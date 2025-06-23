
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Shield, Award, Target, Building } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";

interface CompanyRating {
  id: string;
  name: string;
  ratings: {
    'Compromised Systems': number;
    'Diligence': number;
    'User Behavior': number;
    'File Sharing': number;
  };
  isParent?: boolean;
  subsidiaries?: CompanyRating[];
}

interface BitsightScorecardProps {
  companies?: CompanyRating[];
  selectedCompany?: string;
  onCompanyChange?: (companyId: string) => void;
}

export const BitsightScorecard = ({ 
  companies = [], 
  selectedCompany,
  onCompanyChange 
}: BitsightScorecardProps) => {
  const getCurrentCompany = (): CompanyRating => {
    if (!selectedCompany && companies.length > 0) return companies[0];
    
    for (const company of companies) {
      if (company.id === selectedCompany) return company;
      if (company.subsidiaries) {
        const subsidiary = company.subsidiaries.find(sub => sub.id === selectedCompany);
        if (subsidiary) return subsidiary;
      }
    }
    
    // Fallback to mock data if no real company data
    return {
      id: 'fallback',
      name: 'Your Organization',
      ratings: {
        'Compromised Systems': 780,
        'Diligence': 720,
        'User Behavior': 690,
        'File Sharing': 750
      }
    };
  };

  const currentCompany = getCurrentCompany();
  const compromisedSystemsRating = currentCompany.ratings['Compromised Systems'];
  const previousRating = 765; // Mock previous rating
  const ratingChange = compromisedSystemsRating - previousRating;
  
  const getLetterGrade = (rating: number): string => {
    if (rating >= 800) return 'A+';
    if (rating >= 780) return 'A';
    if (rating >= 750) return 'A-';
    if (rating >= 720) return 'B+';
    if (rating >= 700) return 'B';
    if (rating >= 650) return 'B-';
    if (rating >= 600) return 'C+';
    if (rating >= 550) return 'C';
    if (rating >= 500) return 'C-';
    if (rating >= 450) return 'D';
    return 'F';
  };

  const letterGrade = getLetterGrade(compromisedSystemsRating);
  const previousGrade = getLetterGrade(previousRating);

  // Generate rating history for the selected company
  const ratingHistory = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const baseRating = compromisedSystemsRating - 50;
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      rating: baseRating + Math.floor(Math.random() * 60) + (i * 3),
      grade: getLetterGrade(baseRating + Math.floor(Math.random() * 60) + (i * 3))
    };
  });

  // Prepare subsidiary comparison data
  const subsidiaryData = companies.length > 0 ? 
    companies.flatMap(company => 
      company.subsidiaries ? company.subsidiaries.map(sub => ({
        name: sub.name.split(' ')[0], // Shorten name
        rating: sub.ratings['Compromised Systems'],
        grade: getLetterGrade(sub.ratings['Compromised Systems'])
      })) : []
    ) : [];

  const getGradeColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'text-green-400 bg-green-500/20',
      'A': 'text-green-400 bg-green-500/20',
      'A-': 'text-green-400 bg-green-500/20',
      'B+': 'text-blue-400 bg-blue-500/20',
      'B': 'text-blue-400 bg-blue-500/20',
      'B-': 'text-yellow-400 bg-yellow-500/20',
      'C+': 'text-orange-400 bg-orange-500/20',
      'C': 'text-orange-400 bg-orange-500/20',
      'C-': 'text-red-400 bg-red-500/20',
      'D': 'text-red-400 bg-red-500/20',
      'F': 'text-red-400 bg-red-500/20'
    };
    return colors[grade] || 'text-gray-400 bg-gray-500/20';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 780) return 'text-green-400';
    if (rating >= 720) return 'text-blue-400';
    if (rating >= 650) return 'text-yellow-400';
    if (rating >= 600) return 'text-orange-400';
    return 'text-red-400';
  };

  const chartConfig = {
    rating: {
      label: "Compromised Systems Rating",
      color: "#3b82f6",
    }
  };

  const allCompanyOptions = companies.flatMap(company => [
    { id: company.id, name: company.name, isParent: true },
    ...(company.subsidiaries || []).map(sub => ({ 
      id: sub.id, 
      name: `${sub.name}`, 
      isParent: false 
    }))
  ]);

  return (
    <div className="space-y-6">
      {/* Company Selector */}
      {companies.length > 0 && (
        <Card className="neo-premium">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-400" />
              Company Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompany} onValueChange={onCompanyChange}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select a company or subsidiary" />
              </SelectTrigger>
              <SelectContent>
                {allCompanyOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.isParent ? "🏢" : "🏬"} {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Compromised Systems Rating */}
        <Card className="neo-premium">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Compromised Systems Rating
            </CardTitle>
            <p className="text-sm text-gray-400">{currentCompany.name}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-4xl font-bold ${getRatingColor(compromisedSystemsRating)}`}>
                    {compromisedSystemsRating}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {ratingChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm ${ratingChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {ratingChange > 0 ? '+' : ''}{ratingChange} from last month
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-2xl font-bold px-4 py-2 ${getGradeColor(letterGrade)}`}>
                    {letterGrade}
                  </Badge>
                  <p className="text-xs text-gray-400 mt-1">
                    Previous: {previousGrade}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Industry Percentile</span>
                  <span className="text-white">82nd</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Peer Comparison</span>
                  <span className="text-green-400">Above Average</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk Level</span>
                  <span className="text-yellow-400">Low</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Categories Breakdown */}
        <Card className="neo-premium">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Rating Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(currentCompany.ratings).map(([category, score]) => {
                const grade = getLetterGrade(score);
                const isCompromised = category === 'Compromised Systems';
                return (
                  <div key={category} className={`flex items-center justify-between p-3 rounded-lg ${isCompromised ? 'bg-blue-800/30 border border-blue-500/30' : 'bg-gray-800/30'}`}>
                    <div>
                      <p className={`text-sm font-medium ${isCompromised ? 'text-blue-300' : 'text-white'}`}>
                        {category}
                        {isCompromised && ' (Primary)'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${getRatingColor(score)}`}>
                          {score}
                        </span>
                        <Badge className={`text-xs ${getGradeColor(grade)}`}>
                          {grade}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {isCompromised ? (
                        <Shield className="h-4 w-4 text-blue-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rating Trend Chart */}
        <Card className="neo-premium">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" />
              Rating Trend (12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingHistory}>
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 20', 'dataMax + 20']}
                    stroke="#9ca3af"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current Rating</span>
                <span className="text-blue-400">{compromisedSystemsRating}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">12-Month Change</span>
                <span className="text-green-400">+{compromisedSystemsRating - (compromisedSystemsRating - 45)} points</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subsidiary Comparison Chart */}
      {subsidiaryData.length > 0 && (
        <Card className="neo-premium">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-green-400" />
              Subsidiary Ratings Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subsidiaryData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar 
                    dataKey="rating" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
