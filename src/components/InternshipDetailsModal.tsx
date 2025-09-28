import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, DollarSign, Building2, ExternalLink, Award, Users } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Internship = Tables<"internships">;

interface InternshipDetailsModalProps {
  internship: Internship;
  trigger: React.ReactNode;
}

export function InternshipDetailsModal({ internship, trigger }: InternshipDetailsModalProps) {
  const skillsArray = internship.skills 
    ? internship.skills.split(",").map(s => s.trim())
    : [];

  const handleApplyNow = () => {
    // Redirect to PM Internship Scheme website
    window.open("https://www.pminternship.gov.in/", "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">
            {internship.title || "Product Management Intern"}
          </DialogTitle>
          <div className="flex items-center text-muted-foreground">
            <Building2 className="h-5 w-5 mr-2" />
            <span className="text-lg font-medium">{internship.organization || "Company"}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internship.location && (
              <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{internship.location}</p>
                </div>
              </div>
            )}
            
            {internship.duration && (
              <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{internship.duration}</p>
                </div>
              </div>
            )}
            
            {internship.start_date && (
              <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{internship.start_date}</p>
                </div>
              </div>
            )}
            
            {internship.stipend && (
              <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <DollarSign className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Stipend</p>
                  <p className="font-medium">{internship.stipend}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sector */}
          {internship.sector && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Sector</h3>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {internship.sector}
              </Badge>
            </div>
          )}

          {/* Skills Required */}
          {skillsArray.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Perks */}
          {internship.perks && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Perks & Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {internship.perks.split(",").map((perk, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {perk.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          {internship.source && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Source
              </h3>
              <p className="text-muted-foreground">{internship.source}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button 
              onClick={handleApplyNow}
              className="flex-1"
              size="lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Apply on PM Internship Scheme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}