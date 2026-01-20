<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class InfluencerHistoryController extends Controller
{
    /**
     * List all users with the 'influencer' role.
     */
    public function list()
    {
        try {
            // Safely fetch influencers.
            // Using whereHas is safer than scoping if the role might be missing in Spatie's cache or DB
            $influencers = User::whereHas('roles', function($q) {
                $q->where('name', 'influencer');
            })->select('id', 'name')->get();

            return response()->json($influencers);
        } catch (\Exception $e) {
            \Log::error('Error fetching influencers: ' . $e->getMessage());
            return response()->json(['error' => 'Server Error'], 500);
        }
    }

    /**
     * Get company visit history for a specific influencer.
     */
    public function history(Request $request, $id)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $query = Booking::with('company:id,name,logo') // Eager load company details
            ->where('user_id', $id)
            ->whereNotNull('company_id') // Ensure it's a visit to a company
            ->orderBy('start_time', 'desc');

        if ($request->start_date) {
            $query->whereDate('start_time', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->whereDate('start_time', '<=', $request->end_date);
        }

        $history = $query->get()->map(function ($booking) {
            return [
                'id' => $booking->id,
                'company_name' => $booking->company ? $booking->company->name : 'N/A',
                'company_logo' => $booking->company ? $booking->company->logo : null,
                'date' => Carbon::parse($booking->start_time)->format('Y-m-d H:i'),
                'status' => $booking->status,
            ];
        });

        return response()->json($history);
    }
}
