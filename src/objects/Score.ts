export class Score {
  scene: Phaser.Scene

  scoreText: Phaser.GameObjects.Text

  highscoreText: Phaser.GameObjects.Text

  score: number

  highscore: number

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.scoreText = this.scene.add.text(
      40,
      40,
      'Score: 0',
      {
        fontFamily: 'Pixel miners',
        fontSize: '24px',
      },
    );

    this.scoreText.setOrigin(0, 0);
    this.score = 0;

    this.highscore = +(window.localStorage.getItem('highscore') || 0);
    this.highscoreText = this.scene.add.text(
      40,
      75,
      `Highscore: ${this.highscore}`,
      {
        fontFamily: 'Pixel miners',
        fontSize: '24px',
      },
    );

    this.highscoreText.setOrigin(0, 0);
  }

  addScore(): void {
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score > this.highscore) {
      this.highscore = this.score;
      window.localStorage.setItem('highscore', this.highscore.toString());
      this.highscoreText.setText(`Highscore: ${this.highscore}`);
    }
  }

  center() {
    this.scoreText.setOrigin(0.5).setPosition(1280 / 2, 720 / 2 - 200);
    this.highscoreText.setOrigin(0.5).setPosition(1280 / 2, 720 / 2 - 150);
  }
}
