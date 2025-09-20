import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Play, Save, History, Trash2 } from 'lucide-react';
import { GamePlayer } from '@/components/GamePlayer';
import { useGameGenerator } from '@/hooks/useGameGenerator';
import { GameData, GameMetadata, GenerationOptions } from '@/types/game';
import { toast } from 'sonner';

export const GeneratePage = () => {
  const [prompt, setPrompt] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    gameType: 'platformer',
    difficulty: 'medium',
    theme: 'cyberpunk'
  });
  
  const [activeTab, setActiveTab] = useState('generate');
  const [history, setHistory] = useState<GameMetadata[]>([]);
  
  const {
    isGenerating,
    error,
    currentGame,
    generateGame,
    saveGame,
    loadGame,
    getGameHistory,
    deleteGame
  } = useGameGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a game description');
      return;
    }
    
    await generateGame(prompt, options);
  };

  const handleSaveGame = (gameData: GameData) => {
    if (!gameTitle.trim()) {
      toast.error('Please enter a game title');
      return;
    }
    
    const metadata = {
      title: gameTitle,
      prompt,
      files: Object.keys(gameData.files)
    };
    
    saveGame(gameData, metadata);
    setGameTitle('');
    refreshHistory();
  };

  const handleLoadGame = (id: string) => {
    const game = loadGame(id);
    if (game) {
      setActiveTab('play');
      refreshHistory();
    }
  };

  const handleDeleteGame = (id: string) => {
    deleteGame(id);
    refreshHistory();
  };

  const refreshHistory = () => {
    setHistory(getGameHistory());
  };

  const suggestedPrompts = [
    'A cyberpunk platformer with neon aesthetics and hacking mechanics',
    'Medieval fantasy adventure with magic spells and dragon encounters', 
    'Space exploration game with asteroid dodging and alien encounters',
    'Underwater racing game with sea creatures and coral obstacles',
    'Steampunk puzzle game with mechanical contraptions',
    'Post-apocalyptic survival game with resource management'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-gaming-glow bg-clip-text text-transparent">
            Forge Genesis Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create amazing games with AI-powered generation. Describe your vision and watch it come to life.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="play" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Play
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2" onClick={refreshHistory}>
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card className="tech-panel border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Game Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt">Game Description</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe the game you want to create..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-2 min-h-[120px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="title">Game Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a title for your game"
                        value={gameTitle}
                        onChange={(e) => setGameTitle(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>Game Type</Label>
                        <Select 
                          value={options.gameType} 
                          onValueChange={(value: any) => setOptions(prev => ({ ...prev, gameType: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="platformer">Platformer</SelectItem>
                            <SelectItem value="shooter">Shooter</SelectItem>
                            <SelectItem value="puzzle">Puzzle</SelectItem>
                            <SelectItem value="racing">Racing</SelectItem>
                            <SelectItem value="strategy">Strategy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Difficulty</Label>
                        <Select 
                          value={options.difficulty} 
                          onValueChange={(value: any) => setOptions(prev => ({ ...prev, difficulty: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Input
                          id="theme"
                          placeholder="e.g., cyberpunk, medieval, space"
                          value={options.theme}
                          onChange={(e) => setOptions(prev => ({ ...prev, theme: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Game
                        </>
                      )}
                    </Button>

                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                        {error}
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="tech-panel border-primary/30 p-6">
                  <h4 className="text-md font-semibold text-foreground mb-3">Suggested Prompts</h4>
                  <div className="space-y-2">
                    {suggestedPrompts.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(suggestion)}
                        className="text-left text-sm text-muted-foreground hover:text-primary p-2 rounded border border-transparent hover:border-primary/30 transition-colors w-full"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {currentGame ? (
                  <GamePlayer 
                    gameData={currentGame}
                    onSave={handleSaveGame}
                  />
                ) : (
                  <Card className="tech-panel border-primary/30 p-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Create</h3>
                    <p className="text-muted-foreground">
                      Configure your game settings and click "Generate Game" to get started
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="play">
            {currentGame ? (
              <GamePlayer gameData={currentGame} />
            ) : (
              <Card className="tech-panel border-primary/30 p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Game Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a new game or load one from your history to start playing
                </p>
                <Button onClick={() => setActiveTab('generate')}>
                  Generate New Game
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="tech-panel border-primary/30 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Game History</h3>
              
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">No Games Yet</h4>
                  <p className="text-muted-foreground mb-4">
                    Generate and save games to see them in your history
                  </p>
                  <Button onClick={() => setActiveTab('generate')}>
                    Create Your First Game
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((game) => (
                    <Card key={game.id} className="border-primary/20 p-4 hover:border-primary/40 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-foreground truncate">{game.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGame(game.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {game.prompt}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Plays: {game.plays}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleLoadGame(game.id)}
                        size="sm" 
                        className="w-full"
                      >
                        Load Game
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};