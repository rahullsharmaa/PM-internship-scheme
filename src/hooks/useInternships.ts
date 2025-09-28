import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Internship = Tables<"internships">;

export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInternships = async (filters?: {
    skills?: string;
    location?: string;
    sector?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase.from("internships").select("*");

      if (filters?.skills) {
        query = query.ilike("skills", `%${filters.skills}%`);
      }
      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters?.sector && filters.sector !== "All Sectors") {
        query = query.ilike("sector", `%${filters.sector}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInternships(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch internships");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = (userProfile: {
    skills: string;
    location?: string;
    sector?: string;
  }) => {
    if (!userProfile.skills || internships.length === 0) return [];

    const userSkills = userProfile.skills
      .toLowerCase()
      .split(",")
      .map(s => s.trim());

    const scored = internships.map(internship => {
      let score = 0;
      
      // Skills matching
      if (internship.skills) {
        const internshipSkills = internship.skills.toLowerCase().split(",").map(s => s.trim());
        const matchingSkills = userSkills.filter(skill => 
          internshipSkills.some(iSkill => iSkill.includes(skill) || skill.includes(iSkill))
        );
        score += matchingSkills.length * 3;
      }

      // Location preference
      if (userProfile.location && internship.location) {
        if (internship.location.toLowerCase().includes(userProfile.location.toLowerCase())) {
          score += 2;
        }
      }

      // Sector preference
      if (userProfile.sector && internship.sector) {
        if (internship.sector.toLowerCase().includes(userProfile.sector.toLowerCase())) {
          score += 2;
        }
      }

      return { ...internship, matchScore: score };
    });

    return scored
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return {
    internships,
    loading,
    error,
    fetchInternships,
    getRecommendations,
  };
}