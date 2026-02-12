export interface Contact {
  id: number;
  nombrecompleto: string;
  correoelectronico: string;
  presupuesto: string;
  celular: string;
  descripcion: string;
  empresa: string;
  estado: boolean;
  estado_label: string;
  created_at: string;
}

export interface ContactForm {
  nombrecompleto: string;
  correoelectronico: string;
  presupuesto: string | number;
  celular: string;
  descripcion: string;
  empresa: string;
  estado?: boolean;
}
