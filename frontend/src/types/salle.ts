export interface Materiel {
  nom: string;
  type: string;
  quantite: number;
  etat: string;
  date_acquisition?: string | null; // "yyyy-MM-ddTHH:mm" (datetime-local)
}

export interface SalleResponse {
  id: number;
  nom: string;
  type: string;
  capacite: number;
  quantite: number;
  etat: string;
  materiels: Materiel[];
}

// POST /salles, PUT /salles/{id} -> SalleRequestDto
export interface SalleRequestPayload {
  nom: string;
  type: string;
  capacite: number;
  quantite: number;
  etat: string;
  date_acquisition?: string | null;
  materiels: Materiel[];
}
