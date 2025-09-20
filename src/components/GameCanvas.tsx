import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface GameCanvasProps {
  gameType?: string;
  isGenerating?: boolean;
}

export const GameCanvas = ({ gameType = 'platformer', isGenerating = false }: GameCanvasProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [performance, setPerformance] = useState({ fps: 60, memory: 45 });

  useEffect(() => {
    if (!gameRef.current || isGenerating) return;

    // Demo Phaser.js game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#0a0a0f',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 300 },
          debug: false
        }
      },
      scene: {
        key: 'default',
        preload: function() {
          // Create simple colored rectangles as sprites
          this.add.graphics()
            .fillStyle(0x00ffff)
            .fillRect(0, 0, 32, 32)
            .generateTexture('player', 32, 32);
          
          this.add.graphics()
            .fillStyle(0xff00ff)
            .fillRect(0, 0, 64, 32)
            .generateTexture('platform', 64, 32);

          this.add.graphics()
            .fillStyle(0xffff00)
            .fillRect(0, 0, 16, 16)
            .generateTexture('coin', 16, 16);
        },
        create: function() {
          // Add platforms
          const platforms = this.physics.add.staticGroup();
          platforms.create(400, 568, 'platform').setScale(12, 1);
          platforms.create(600, 400, 'platform').setScale(2, 1);
          platforms.create(50, 250, 'platform').setScale(2, 1);
          platforms.create(750, 220, 'platform').setScale(2, 1);

          // Add player
          const player = this.physics.add.sprite(100, 450, 'player');
          player.setBounce(0.2);
          player.setCollideWorldBounds(true);
          this.physics.add.collider(player, platforms);

          // Add coins
          const coins = this.physics.add.group({
            key: 'coin',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
          });
          coins.children.entries.forEach((coin: any) => {
            coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          });
          this.physics.add.collider(coins, platforms);

          // Player-coin collision
          this.physics.add.overlap(player, coins, (player: any, coin: any) => {
            coin.disableBody(true, true);
          });

          // Keyboard controls
          const cursors = this.input.keyboard?.createCursorKeys();
          
          // Update function
          const updatePlayer = () => {
            if (!cursors) return;
            
            if (cursors.left.isDown) {
              player.setVelocityX(-160);
            } else if (cursors.right.isDown) {
              player.setVelocityX(160);
            } else {
              player.setVelocityX(0);
            }

            if (cursors.up.isDown && player.body?.touching.down) {
              player.setVelocityY(-530);
            }
          };

          this.update = updatePlayer;

          // Add particles for visual appeal
          const particles = this.add.particles(0, 0, 'coin', {
            scale: { start: 0.1, end: 0 },
            speed: { min: 50, max: 100 },
            lifespan: 1000,
            emitting: false
          });

          // Emit particles when coins are collected
          this.physics.world.on('overlap', () => {
            particles.emitParticleAt(player.x, player.y);
          });
        }
      }
    };

    phaserGameRef.current = new Phaser.Game(config);
    setIsPlaying(true);

    // Performance monitoring
    const interval = setInterval(() => {
      setPerformance({
        fps: Math.floor(Math.random() * 5) + 58, // Mock FPS between 58-62
        memory: Math.floor(Math.random() * 10) + 40 // Mock memory between 40-50MB
      });
    }, 1000);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
      clearInterval(interval);
    };
  }, [gameType, isGenerating]);

  const handlePlayPause = () => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('default');
      if (scene) {
        if (isPlaying) {
          phaserGameRef.current.scene.pause('default');
        } else {
          phaserGameRef.current.scene.resume('default');
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const handleRestart = () => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('default');
      if (scene) {
        phaserGameRef.current.scene.start('default');
        setIsPlaying(true);
      }
    }
  };

  return (
    <Card className="tech-panel border-primary/30 overflow-hidden">
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Game Preview</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                FPS: <span className="text-gaming-glow">{performance.fps}</span>
              </span>
              <span className="flex items-center gap-1">
                Memory: <span className="text-gaming-energy">{performance.memory}MB</span>
              </span>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium text-primary">Generating Game...</p>
              <p className="text-sm text-muted-foreground">AI is creating your {gameType} game</p>
            </div>
          </div>
        )}
        
        <div 
          ref={gameRef} 
          className="w-full h-[600px] bg-gradient-to-br from-background to-secondary/20"
          style={{ minHeight: '600px' }}
        />
        
        {!isGenerating && (
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
            <p className="text-sm text-muted-foreground">Use arrow keys to move and jump</p>
            <p className="text-xs text-gaming-glow">Demo: Cyberpunk Platformer</p>
          </div>
        )}
      </div>
    </Card>
  );
};