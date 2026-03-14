export interface Patient {
    id: number;
    hrn: string;
    firstname: string;
    middlename: string | null;
    lastname: string;
    records_count: number;
}

export interface Props {
    patients: Patient[];
    filters: any;
}