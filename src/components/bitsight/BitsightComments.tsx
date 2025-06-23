
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, User, Calendar } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  mentions: string[];
}

interface BitsightCommentsProps {
  vulnerabilityId?: string;
}

export const BitsightComments = ({ vulnerabilityId = "sample-vuln" }: BitsightCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Alice Johnson",
      content: "This vulnerability affects our production environment. @bob.smith please prioritize the Apache server patch.",
      timestamp: "2024-01-15T10:30:00Z",
      mentions: ["bob.smith"]
    },
    {
      id: "2", 
      author: "Bob Smith",
      content: "Thanks for the heads up @alice.johnson. I'll schedule the patch for tonight's maintenance window.",
      timestamp: "2024-01-15T11:15:00Z",
      mentions: ["alice.johnson"]
    }
  ]);
  
  const [newComment, setNewComment] = useState("");
  
  const teamMembers = [
    "alice.johnson", "bob.smith", "carol.davis", "david.wilson", "eve.brown"
  ];

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const mentions = teamMembers.filter(member => 
      newComment.includes(`@${member}`)
    );

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      timestamp: new Date().toISOString(),
      mentions
    };

    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  const handleMention = (username: string) => {
    const cursorPos = newComment.length;
    const newText = newComment + `@${username} `;
    setNewComment(newText);
  };

  const formatContent = (content: string) => {
    let formatted = content;
    teamMembers.forEach(member => {
      const mentionRegex = new RegExp(`@${member}`, 'g');
      formatted = formatted.replace(mentionRegex, `<span class="text-blue-400 font-medium">@${member}</span>`);
    });
    return formatted;
  };

  return (
    <Card className="neo-premium">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          Team Collaboration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Internal comments and team coordination
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-900/30 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium text-white">{comment.author}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(comment.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div 
                className="text-sm text-gray-300 mb-2"
                dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
              />
              {comment.mentions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {comment.mentions.map(mention => (
                    <Badge key={mention} variant="outline" className="text-xs">
                      @{mention}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="space-y-3 border-t border-gray-700 pt-4">
          <Textarea
            placeholder="Add a comment... Use @username to mention team members"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
            rows={3}
          />
          
          {/* Quick Mentions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-400">Quick mentions:</span>
            {teamMembers.map(member => (
              <Button
                key={member}
                variant="ghost"
                size="sm"
                onClick={() => handleMention(member)}
                className="h-6 px-2 text-xs text-gray-400 hover:text-blue-400"
              >
                @{member}
              </Button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {newComment.length}/500 characters
            </span>
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="btn-premium"
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
