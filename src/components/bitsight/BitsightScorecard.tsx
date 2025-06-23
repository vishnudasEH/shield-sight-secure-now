
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Shield, Award, Target } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const BitsightScorecard = () => {
  // Mock Bitsight scorecard data
  const securityRating = 720;
  const previousRating = 695;
  const letterGrade = 'B+';
  const previousGrade = 'B';
  const ratingChange = securityRating - previousRating;
  
  // Mock rating history (last 12 months)
  const ratingHistory = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      rating: 650 + Math.floor(Math.random() * 100) + (i * 5), // Trending upward
      grade: ['C', 'C+', 'B-', 'B', 'B+', 'A-'][Math.floor((650 + i * 5) / 100) - 6] || 'B'
    };
  });

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
    if (rating >= 750) return 'text-green-400';
    if (rating >= 700) return 'text-blue-400';
    if (rating >= 650) return 'text-yellow-400';
    if (rating >= 600) return 'text-orange-400';
    return 'text-red-400';
  };

  const chartConfig = {
    rating: {
      label: "Security Rating",
      color: "#3b82f6",
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Security Rating */}
      <Card className="neo-premium">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Bitsight Security Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-4xl font-bold ${getRatingColor(securityRating)}`}>
                  {securityRating}
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
                <span className="text-white">78th</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Peer Comparison</span>
                <span className="text-green-400">Above Average</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Risk Level</span>
                <span className="text-yellow-400">Moderate</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Categories */}
      <Card className="neo-premium">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Rating Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { category: 'Compromised Systems', score: 780, grade: 'A-', trend: 'up' },
              { category: 'Diligence', score: 720, grade: 'B+', trend: 'stable' },
              { category: 'User Behavior', score: 690, grade: 'B', trend: 'down' },
              { category: 'File Sharing', score: 750, grade: 'A-', trend: 'up' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <div>
                  <p className="text-sm font-medium text-white">{item.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${getRatingColor(item.score)}`}>
                      {item.score}
                    </span>
                    <Badge className={`text-xs ${getGradeColor(item.grade)}`}>
                      {item.grade}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400" />}
                  {item.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                  {item.trend === 'stable' && <div className="h-4 w-4 rounded-full bg-gray-400"></div>}
                </div>
              </div>
            ))}
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
              <span className="text-gray-400">Best Rating</span>
              <span className="text-green-400">785 (3 months ago)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Lowest Rating</span>
              <span className="text-red-400">655 (11 months ago)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">12-Month Improvement</span>
              <span className="text-blue-400">+65 points</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
