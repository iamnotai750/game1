class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-board');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.startButton = document.getElementById('start-btn');
        
        this.gridSize = 20;
        this.snake = [];
        this.food = {};
        this.speedBoost = {};
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.gameSpeed = 150;
        this.isSpeedBoosted = false;
        this.speedBoostTimer = null;
        
        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        this.snake = [
            {x: 5, y: 5},
            {x: 4, y: 5},
            {x: 3, y: 5}
        ];
        this.direction = 'right';
        this.score = 0;
        this.gameSpeed = 150;
        this.isSpeedBoosted = false;
        if (this.speedBoostTimer) clearTimeout(this.speedBoostTimer);
        
        this.updateScore();
        this.generateFood();
        this.generateSpeedBoost();
        
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
        
        this.startButton.textContent = '다시 시작';
    }

    update() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
        } else if (head.x === this.speedBoost.x && head.y === this.speedBoost.y) {
            this.activateSpeedBoost();
            this.generateSpeedBoost();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        return (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= this.canvas.width / this.gridSize ||
            head.y >= this.canvas.height / this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    generateFood() {
        const maxX = this.canvas.width / this.gridSize - 1;
        const maxY = this.canvas.height / this.gridSize - 1;
        
        do {
            this.food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (
            this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y) ||
            (this.food.x === this.speedBoost.x && this.food.y === this.speedBoost.y)
        );
    }

    generateSpeedBoost() {
        const maxX = this.canvas.width / this.gridSize - 1;
        const maxY = this.canvas.height / this.gridSize - 1;
        
        do {
            this.speedBoost = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (
            this.snake.some(segment => segment.x === this.speedBoost.x && segment.y === this.speedBoost.y) ||
            (this.speedBoost.x === this.food.x && this.speedBoost.y === this.food.y)
        );
    }

    activateSpeedBoost() {
        this.isSpeedBoosted = true;
        this.gameSpeed = 75;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);

        if (this.speedBoostTimer) clearTimeout(this.speedBoostTimer);
        this.speedBoostTimer = setTimeout(() => {
            this.isSpeedBoosted = false;
            this.gameSpeed = 150;
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
        }, 5000);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 뱀 그리기
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? (this.isSpeedBoosted ? '#FFA000' : '#4CAF50') : '#81C784';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // 먹이 그리기
        this.ctx.fillStyle = '#FF5252';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        // 스피드 부스트 아이템 그리기
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillRect(
            this.speedBoost.x * this.gridSize,
            this.speedBoost.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );
    }

    handleKeyPress(event) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const newDirection = keyMap[event.key];
        if (!newDirection) return;

        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[newDirection] !== this.direction) {
            this.direction = newDirection;
        }
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        if (this.speedBoostTimer) clearTimeout(this.speedBoostTimer);
        alert(`게임 오버! 점수: ${this.score}`);
    }

    updateScore() {
        this.scoreElement.textContent = `점수: ${this.score}`;
    }
}

// 게임 인스턴스 생성
const game = new SnakeGame();