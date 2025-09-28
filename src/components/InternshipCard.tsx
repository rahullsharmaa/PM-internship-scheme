import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, DollarSign, Building2, Bookmark } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";
import { InternshipDetailsModal } from "./InternshipDetailsModal";

type Internship = Tables<"internships">;

interface InternshipCardProps {
  internship: Internship;
  showMatchScore?: boolean;
  matchScore?: number;
}

export function InternshipCard({ internship, showMatchScore, matchScore }: InternshipCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleApplyNow = () => {
    // Redirect to PM Internship Scheme website
    window.open("https://www.pminternship.gov.in/", "_blank");
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you would implement saving logic
  };

  const skillsArray = internship.skills 
    ? internship.skills.split(",").map(s => s.trim()).slice(0, 3)
    : [];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {internship.title || "Product Management Intern"}
            </CardTitle>
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-4 w-4 mr-2" />
              <span className="font-medium">{internship.organization || "Company"}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {showMatchScore && matchScore && (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                {Math.round(matchScore * 10)}% match
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="rounded-full"
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isSaved ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {internship.location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{internship.location}</span>
            </div>
          )}
          
          {internship.duration && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>{internship.duration}</span>
            </div>
          )}
          
          {internship.start_date && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>{internship.start_date}</span>
            </div>
          )}
          
          {internship.stipend && (
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <span>{internship.stipend}</span>
            </div>
          )}
        </div>

        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillsArray.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {internship.sector && (
          <Badge variant="outline" className="w-fit">
            {internship.sector}
          </Badge>
        )}

        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1" onClick={handleApplyNow}>
            Apply Now
          </Button>
          <InternshipDetailsModal 
            internship={internship}
            trigger={
              <Button variant="outline" size="sm">
                View Details
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}