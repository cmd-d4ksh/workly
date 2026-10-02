import { City } from "@/lib/types";

export const NEIGHBORHOODS: Record<City, string[]> = {
  Mumbai: ["Lower Parel", "Bandra Kurla Complex", "Andheri East", "Powai", "Vikhroli", "Worli"],
  Bangalore: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "MG Road", "Electronic City"],
  Delhi: ["Connaught Place", "Saket", "Nehru Place", "Hauz Khas", "Vasant Kunj"],
  Pune: ["Koregaon Park", "Baner", "Hinjewadi", "Viman Nagar"],
  Hyderabad: ["Hitech City", "Gachibowli", "Banjara Hills", "Madhapur"],
  Gurgaon: ["Cyber City", "Sohna Road", "Golf Course Road", "Udyog Vihar"],
};

// Approximate city-center coordinates; per-space lat/lng jitters around these.
export const CITY_CENTERS: Record<City, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Gurgaon: { lat: 28.4595, lng: 77.0266 },
};
