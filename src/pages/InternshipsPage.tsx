import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { InternshipCard } from "@/components/InternshipCard";
import { useInternships } from "@/hooks/useInternships";
import { AIQuestionnaire, QuestionnaireAnswers } from "@/components/AIQuestionnaire";
import { AIRecommendations } from "@/components/AIRecommendations";
import { getAIRecommendations, InternshipRecommendation } from "@/services/geminiService";
import { useToast } from "@/hooks/use-toast";

const sectors = ["All Sectors", "Technology", "Finance", "Marketing", "Design", "Healthcare", "Education", "Consulting"];

export default function InternshipsPage() {
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [sector, setSector] = useState("All Sectors");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<InternshipRecommendation[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  
  const { internships, loading, fetchInternships, getRecommendations } = useInternships();
  const { toast } = useToast();

  const handleSearch = () => {
    const filters: any = {};
    if (skills.trim()) filters.skills = skills.trim();
    if (location.trim()) filters.location = location.trim();
    if (sector !== "All Sectors") filters.sector = sector;

    fetchInternships(Object.keys(filters).length > 0 ? filters : undefined);
    setShowRecommendations(false);
  };

  const handleGetRecommendations = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = async (answers: QuestionnaireAnswers) => {
    setShowQuestionnaire(false);
    setLoadingAI(true);
    
    try {
      const recommendations = await getAIRecommendations(answers, internships);
      setAiRecommendations(recommendations);
      setShowRecommendations(true);
      
      toast({
        title: "AI Recommendations Ready!",
        description: `Found ${recommendations.length} personalized internship recommendations for you.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const recommendedInternships = showRecommendations 
    ? aiRecommendations.length > 0 
      ? aiRecommendations 
      : getRecommendations({ skills, location, sector: sector !== "All Sectors" ? sector : undefined })
    : [];

  const displayedInternships = showRecommendations 
    ? (aiRecommendations.length > 0 ? [] : recommendedInternships)
    : internships;

  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded w-16"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Your Perfect Internship
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use our AI-powered recommendation engine to discover internships tailored to your skills and interests
          </p>
        </div>

        {/* Search/Filter Section */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Skills *</label>
                <Input
                  placeholder="e.g. React, Python, Product Strategy"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preferred Location</label>
                <Input
                  placeholder="e.g. Mumbai, Bangalore, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sector</label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleGetRecommendations} 
                variant="hero"
                disabled={loading || loadingAI}
                className="flex-1 sm:flex-none"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {loadingAI ? "Analyzing..." : "Get AI Recommendations"}
              </Button>
              <Button 
                onClick={handleSearch} 
                variant="outline"
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                <Search className="mr-2 h-4 w-4" />
                Search All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            {loading || loadingAI ? "Searching..." : 
             showRecommendations && aiRecommendations.length > 0 ? `${aiRecommendations.length} AI Recommendations` :
             showRecommendations ? `${recommendedInternships.length} Quick Recommendations` :
             `${internships.length} Internships Found`}
          </h2>
          {showRecommendations && (
            <Button
              variant="ghost"
              onClick={() => {
                setShowRecommendations(false);
                setAiRecommendations([]);
              }}
              className="text-primary"
            >
              View All Internships
            </Button>
          )}
        </div>

        {/* Internship Cards */}
        {loading || loadingAI ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : showRecommendations && aiRecommendations.length > 0 ? (
          <AIRecommendations 
            recommendations={aiRecommendations}
            onClose={() => {
              setShowRecommendations(false);
              setAiRecommendations([]);
            }}
          />
        ) : displayedInternships.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {showRecommendations ? "No recommendations found" : "No internships found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {showRecommendations 
                ? "Try adjusting your skills or preferences to get better recommendations."
                : "Try adjusting your filters to see more results."
              }
            </p>
            <Button
              onClick={() => {
                setSkills("");
                setLocation("");
                setSector("All Sectors");
                setShowRecommendations(false);
                setAiRecommendations([]);
                fetchInternships();
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedInternships.map((internship, index) => (
              <InternshipCard 
                key={index} 
                internship={internship}
                showMatchScore={showRecommendations}
                matchScore={showRecommendations ? (internship as any).matchScore / 10 : undefined}
              />
            ))}
          </div>
        )}

        {/* AI Questionnaire Modal */}
        {showQuestionnaire && (
          <AIQuestionnaire
            onComplete={handleQuestionnaireComplete}
            onClose={() => setShowQuestionnaire(false)}
          />
        )}
      </main>
    </div>
  );
}