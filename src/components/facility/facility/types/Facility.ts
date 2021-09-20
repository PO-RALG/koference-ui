import { FacilityType } from "@/components/facility/facility-type/types/FacilityType";

export interface Facility {
  id: number;
  active: boolean;
  code: string;
  email: string;
  facility_type_id: number;
  location_id: number;
  name: string;
  phone_number: string;
  postal_address: string;
  facility_type: FacilityType;
}
