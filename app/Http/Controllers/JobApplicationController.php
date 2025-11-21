<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = JobApplication::query();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('ci', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $applications = $query->latest()->paginate(10);

        return Inertia::render('admin/job-applications/index', [
            'applications' => $applications,
            'filters' => $request->only(['search']),
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
            'cv' => 'required|max:20480', // 20MB
            'extra_documents.*' => 'nullable|max:20480', // 20MB each
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

    public function show(JobApplication $jobApplication)
    {
        return Inertia::render('admin/job-applications/show', [
            'application' => $jobApplication,
        ]);
    }

    public function edit(JobApplication $jobApplication)
    {
        return Inertia::render('admin/job-applications/edit', [
            'application' => $jobApplication,
        ]);
    }

    public function update(Request $request, JobApplication $jobApplication)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'ci' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'cv' => 'nullable|max:20480', // 20MB
            'extra_documents.*' => 'nullable|max:20480', // 20MB each
        ]);

        $cvPath = $jobApplication->cv;
        if ($request->hasFile('cv')) {
            // Delete old CV if exists
            if ($cvPath && Storage::disk('public')->exists($cvPath)) {
                Storage::disk('public')->delete($cvPath);
            }
            $cvPath = $request->file('cv')->store('job-applications/cv', 'public');
        }

        $extraDocuments = $jobApplication->extra_documents ?? [];
        if ($request->hasFile('extra_documents')) {
            // Delete old extra documents
            if ($extraDocuments) {
                foreach ($extraDocuments as $doc) {
                    if (Storage::disk('public')->exists($doc)) {
                        Storage::disk('public')->delete($doc);
                    }
                }
            }
            $extraDocuments = [];
            foreach ($request->file('extra_documents') as $file) {
                $extraDocuments[] = $file->store('job-applications/extra', 'public');
            }
        }

        $jobApplication->update([
            'full_name' => $request->full_name,
            'ci' => $request->ci,
            'phone' => $request->phone,
            'cv' => $cvPath,
            'extra_documents' => $extraDocuments,
        ]);

        return redirect()->route('admin.job-applications.index')->with('success', 'Aplicación actualizada exitosamente.');
    }

    public function destroy(JobApplication $jobApplication)
    {
        // Delete associated files
        if ($jobApplication->cv && Storage::disk('public')->exists($jobApplication->cv)) {
            Storage::disk('public')->delete($jobApplication->cv);
        }

        if ($jobApplication->extra_documents) {
            foreach ($jobApplication->extra_documents as $doc) {
                if (Storage::disk('public')->exists($doc)) {
                    Storage::disk('public')->delete($doc);
                }
            }
        }

        $jobApplication->delete();

        return redirect()->route('admin.job-applications.index')->with('success', 'Aplicación eliminada exitosamente.');
    }
}