import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Sword, 
  Zap, 
  Puzzle, 
  Car, 
  Rocket,
  Crown,
  Target
} from 'lucide-react';

interface GameTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

export const GameTemplates = ({ onSelectTemplate }: GameTemplatesProps) => {
  const templates = [
    {
      id: 'platformer',
      name: 'Action Platformer',
      icon: Gamepad2,
      description: 'Jump, run, and collect in classic 2D worlds',
      difficulty: 'Beginner',
      color: 'gaming-glow',
      features: ['Physics Engine', 'Collectibles', 'Power-ups', 'Level Design']
    },
    {
      id: 'rpg',
      name: 'Action RPG',
      icon: Sword,
      description: 'Real-time combat with character progression',
      difficulty: 'Advanced',
      color: 'gaming-energy',
      features: ['Combat System', 'Skill Trees', 'Inventory', 'NPCs']
    },
    {
      id: 'shooter',
      name: 'Space Shooter',
      icon: Rocket,
      description: 'Fast-paced action in the depths of space',
      difficulty: 'Intermediate',
      color: 'gaming-tech',
      features: ['Bullet Patterns', 'Power-ups', 'Boss Fights', 'Upgrades']
    },
    {
      id: 'puzzle',
      name: 'Logic Puzzle',
      icon: Puzzle,
      description: 'Mind-bending challenges and brain teasers',
      difficulty: 'Beginner',
      color: 'warning',
      features: ['Logic Gates', 'Progressive Difficulty', 'Hints', 'Solutions']
    },
    {
      id: 'racing',
      name: 'Cyber Racing',
      icon: Car,
      description: 'High-speed racing through neon cityscapes',
      difficulty: 'Intermediate',
      color: 'gaming-glow',
      features: ['Physics Racing', 'Tracks', 'Upgrades', 'Leaderboards']
    },
    {
      id: 'strategy',
      name: 'Tower Defense',
      icon: Target,
      description: 'Strategic defense with resource management',
      difficulty: 'Advanced',
      color: 'gaming-energy',
      features: ['AI Enemies', 'Tower Upgrades', 'Strategy', 'Waves']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="tech-panel border-primary/30">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-gaming-energy" />
          Game Templates
        </h2>
        
        <div className="space-y-3">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Card 
                key={template.id}
                className="p-4 border-secondary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group bg-gradient-to-r from-card to-card/80 hover:from-card hover:to-primary/5"
                onClick={() => onSelectTemplate(template.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${template.color}/20 border border-${template.color}/30 group-hover:shadow-glow transition-all duration-300`}>
                    <Icon className={`w-5 h-5 text-${template.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs border-${getDifficultyColor(template.difficulty)}/30 text-${getDifficultyColor(template.difficulty)}`}
                      >
                        {template.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="text-xs bg-secondary/20 text-muted-foreground"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-secondary/20 text-muted-foreground">
                          +{template.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-primary/20 hover:border-primary hover:bg-primary/10"
        >
          <Zap className="w-4 h-4 mr-2" />
          Create Custom Template
        </Button>
      </div>
    </Card>
  );
};