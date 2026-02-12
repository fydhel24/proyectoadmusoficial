<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->get()->map(function ($contact) {
            return [
                'id' => $contact->id,
                'nombrecompleto' => $contact->nombrecompleto,
                'correoelectronico' => $contact->correoelectronico,
                'presupuesto' => number_format($contact->presupuesto, 2, ',', '.'),
                'celular' => $contact->celular,
                'descripcion' => $contact->descripcion,
                'empresa' => $contact->empresa,
                'estado' => $contact->estado,
                'estado_label' => $contact->estado_label,
                'estado_color' => $contact->estado_color,
                'created_at' => $contact->created_at->format('d/m/Y H:i'),
            ];
        });

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts
        ]);
    }

    public function create()
    {
        return Inertia::render('Contacts/Create');
    }

    public function store(Request $request)
    {
        Validator::make($request->all(), [
            'nombrecompleto' => 'required|string|max:255',
            'correoelectronico' => 'required|email|unique:contacts,correoelectronico',
            'presupuesto' => 'required|numeric|min:0',
            'celular' => 'required|string|max:20',
            'descripcion' => 'required|string',
            'empresa' => 'required|string|max:255',
        ])->validate();

        Contact::create($request->all());

        return redirect()->route('contacts.index')->with('success', 'Contacto creado exitosamente');
    }

    public function edit(Contact $contact)
    {
        return Inertia::render('Contacts/Edit', [
            'contact' => $contact
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        Validator::make($request->all(), [
            'nombrecompleto' => 'required|string|max:255',
            'correoelectronico' => 'required|email|unique:contacts,correoelectronico,' . $contact->id,
            'presupuesto' => 'required|numeric|min:0',
            'celular' => 'required|string|max:20',
            'descripcion' => 'required|string',
            'empresa' => 'required|string|max:255',
            'estado' => 'boolean'
        ])->validate();

        $contact->update($request->all());

        return redirect()->route('contacts.index')->with('success', 'Contacto actualizado exitosamente');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('contacts.index')->with('success', 'Contacto eliminado exitosamente');
    }

    public function toggleEstado(Contact $contact)
    {
        $contact->update(['estado' => !$contact->estado]);

        return back()->with('success', $contact->estado ? 'Marcado como revisado' : 'Marcado como pendiente');
    }
}
