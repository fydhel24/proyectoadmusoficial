<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    public function index()
    {
        $applications = JobApplication::latest()->get();
        return Inertia::render('admin/job-applications/index', [
            'applications' => $applications,
        ]);
    }

    public function create()
    {
        return Inertia::render('job-application/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'ci' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB
            'extra_documents.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        $cvPath = null;
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('job-applications/cv', 'public');
        }

        $extraDocuments = [];
        if ($request->hasFile('extra_documents')) {
            foreach ($request->file('extra_documents') as $file) {
                $extraDocuments[] = $file->store('job-applications/extra', 'public');
            }
        }

        JobApplication::create([
            'full_name' => $request->full_name,
            'ci' => $request->ci,
            'phone' => $request->phone,
            'cv' => $cvPath,
            'extra_documents' => $extraDocuments,
        ]);

        return redirect()->back()->with('success', 'Tu aplicación ha sido enviada exitosamente.');
    }
}