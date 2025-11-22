class Vehicle {
    constructor(type, direction) {
        this.type = type;
        this.direction = direction;
        this.speed = this.getSpeed();
        this.position = this.getStartPosition();
        this.waitTime = 0;
        this.isWaiting = false;
        this.element = this.createElement();
    }

    getSpeed() {
        const speeds = { car: 60, truck: 45, bus: 50, ambulance: 80 };
        const weather = controller.currentWeather;
        let speed = speeds[this.type] + (Math.random() * 20 - 10);
        if (weather === 'rain') speed *= 0.7;
        if (weather === 'fog') speed *= 0.5;
        return speed;
    }

    getStartPosition() {
        const positions = {
            north: { x: 190, y: 450 },
            south: { x: 260, y: 0 },
            east: { x: 0, y: 190 },
            west: { x: 450, y: 260 }
        };
        return positions[this.direction];
    }

    createElement() {
        const div = document.createElement('div');
        div.className = `vehicle ${this.type}`;
        div.style.left = `${this.position.x}px`;
        div.style.top = `${this.position.y}px`;
        return div;
    }

    move(canMove) {
        if (!canMove && this.isNearIntersection()) {
            this.isWaiting = true;
            this.waitTime++;
            return;
        }

        this.isWaiting = false;
        const moveDistance = (this.speed / 3600) * 100;

        switch (this.direction) {
            case 'north':
                this.position.y -= moveDistance;
                break;
            case 'south':
                this.position.y += moveDistance;
                break;
            case 'east':
                this.position.x += moveDistance;
                break;
            case 'west':
                this.position.x -= moveDistance;
                break;
        }

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    isNearIntersection() {
        const center = 225;
        const range = 120;

        switch (this.direction) {
            case 'north':
                return this.position.y <= center + range && this.position.y >= center;
            case 'south':
                return this.position.y >= center - range && this.position.y <= center;
            case 'east':
                return this.position.x >= center - range && this.position.x <= center;
            case 'west':
                return this.position.x <= center + range && this.position.x >= center;
        }
        return false;
    }

    isOutOfBounds() {
        return this.position.x < -70 || this.position.x > 520 || 
               this.position.y < -70 || this.position.y > 520;
    }
}

class TrafficController {
    constructor() {
        this.vehicles = [];
        this.timer = 0;
        this.phaseTimer = 0;
        this.isRunning = false;
        this.currentPhase = 'ns-green';
        this.currentMode = 'normal';
        this.currentWeather = 'clear';
        
        this.settings = {
            greenTime: 15,
            yellowTime: 3,
            vehicleFrequency: 5
        };

        this.statistics = {
            vehiclesPassed: 0,
            totalWaitTime: 0,
            totalVehicles: 0
        };

        this.initializeEventListeners();
        this.updateUI();
    }

    initializeEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('emergencyBtn').addEventListener('click', () => this.spawnEmergency());

        document.getElementById('greenTime').addEventListener('input', (e) => {
            this.settings.greenTime = parseInt(e.target.value);
            document.getElementById('greenTimeValue').textContent = e.target.value + 's';
        });

        document.getElementById('yellowTime').addEventListener('input', (e) => {
            this.settings.yellowTime = parseInt(e.target.value);
            document.getElementById('yellowTimeValue').textContent = e.target.value + 's';
        });

        document.getElementById('vehicleFreq').addEventListener('input', (e) => {
            this.settings.vehicleFrequency = parseInt(e.target.value);
            document.getElementById('vehicleFreqValue').textContent = e.target.value;
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.dataset.mode;
                this.adjustForMode();
            });
        });

        document.querySelectorAll('.weather-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentWeather = e.target.dataset.weather;
                this.applyWeatherEffects();
            });
        });
    }

    adjustForMode() {
        switch (this.currentMode) {
            case 'rush':
                this.settings.vehicleFrequency = 8;
                document.getElementById('vehicleFreq').value = 8;
                document.getElementById('vehicleFreqValue').textContent = '8';
                break;
            case 'normal':
                this.settings.vehicleFrequency = 5;
                document.getElementById('vehicleFreq').value = 5;
                document.getElementById('vehicleFreqValue').textContent = '5';
                break;
            case 'smart':
                // AI mode adjusts dynamically
                break;
        }
    }

    applyWeatherEffects() {
        const intersection = document.getElementById('intersection');
        intersection.classList.remove('night-mode');
        
        // Remove existing rain
        const existingRain = intersection.querySelector('.rain-overlay');
        if (existingRain) existingRain.remove();

        switch (this.currentWeather) {
            case 'night':
                intersection.classList.add('night-mode');
                break;
            case 'rain':
                this.createRain();
                break;
            case 'fog':
                intersection.style.filter = 'blur(1px) brightness(0.9)';
                break;
            case 'clear':
                intersection.style.filter = 'none';
                break;
        }
    }

    createRain() {
        const intersection = document.getElementById('intersection');
        const rainOverlay = document.createElement('div');
        rainOverlay.className = 'rain-overlay';
        
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            rainOverlay.appendChild(drop);
        }
        
        intersection.appendChild(rainOverlay);
    }

    spawnEmergency() {
        const directions = ['north', 'south', 'east', 'west'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const vehicle = new Vehicle('ambulance', direction);
        this.vehicles.push(vehicle);
        this.statistics.totalVehicles++;
        document.getElementById('vehiclesContainer').appendChild(vehicle.element);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.setTrafficLight('ns', 'green');
            this.setTrafficLight('ew', 'red');
            this.currentPhase = 'ns-green';
            this.phaseTimer = 0;
            this.mainLoop();
        }
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        this.stop();
        this.vehicles.forEach(v => v.element.remove());
        this.vehicles = [];
        this.timer = 0;
        this.phaseTimer = 0;
        this.currentPhase = 'ns-green';
        this.statistics = {
            vehiclesPassed: 0,
            totalWaitTime: 0,
            totalVehicles: 0
        };
        this.setTrafficLight('ns', 'red');
        this.setTrafficLight('ew', 'red');
        this.updateUI();
    }

    mainLoop() {
        if (!this.isRunning) return;

        this.timer++;
        this.phaseTimer++;

        this.updateSensors();
        this.updateTrafficLightPhase();
        this.spawnVehicles();
        this.moveVehicles();
        this.cleanupVehicles();
        this.updateUI();

        setTimeout(() => this.mainLoop(), 100);
    }

    updateSensors() {
        const directions = ['north', 'south', 'east', 'west'];
        directions.forEach(dir => {
            const sensor = document.getElementById(dir + 'Sensor');
            const count = this.vehicles.filter(v => 
                v.direction === dir && v.isNearIntersection()
            ).length;
            sensor.classList.toggle('active', count > 0);
        });
    }

    updateTrafficLightPhase() {
        const greenTime = this.settings.greenTime * 10;
        const yellowTime = this.settings.yellowTime * 10;

        if (this.currentMode === 'smart') {
            this.smartTrafficControl();
            return;
        }

        switch (this.currentPhase) {
            case 'ns-green':
                if (this.phaseTimer >= greenTime) {
                    this.currentPhase = 'ns-yellow';
                    this.setTrafficLight('ns', 'yellow');
                    this.phaseTimer = 0;
                }
                break;
            case 'ns-yellow':
                if (this.phaseTimer >= yellowTime) {
                    this.currentPhase = 'ew-green';
                    this.setTrafficLight('ns', 'red');
                    this.setTrafficLight('ew', 'green');
                    this.phaseTimer = 0;
                }
                break;
            case 'ew-green':
                if (this.phaseTimer >= greenTime) {
                    this.currentPhase = 'ew-yellow';
                    this.setTrafficLight('ew', 'yellow');
                    this.phaseTimer = 0;
                }
                break;
            case 'ew-yellow':
                if (this.phaseTimer >= yellowTime) {
                    this.currentPhase = 'ns-green';
                    this.setTrafficLight('ew', 'red');
                    this.setTrafficLight('ns', 'green');
                    this.phaseTimer = 0;
                }
                break;
        }
    }

    smartTrafficControl() {
        const nsCount = this.vehicles.filter(v => 
            (v.direction === 'north' || v.direction === 'south') && v.isNearIntersection()
        ).length;
        
        const ewCount = this.vehicles.filter(v => 
            (v.direction === 'east' || v.direction === 'west') && v.isNearIntersection()
        ).length;

        const minGreenTime = 5 * 10;
        const yellowTime = this.settings.yellowTime * 10;

        if (this.currentPhase === 'ns-green' && this.phaseTimer >= minGreenTime) {
            if (ewCount > nsCount * 1.5) {
                this.currentPhase = 'ns-yellow';
                this.setTrafficLight('ns', 'yellow');
                this.phaseTimer = 0;
            }
        } else if (this.currentPhase === 'ew-green' && this.phaseTimer >= minGreenTime) {
            if (nsCount > ewCount * 1.5) {
                this.currentPhase = 'ew-yellow';
                this.setTrafficLight('ew', 'yellow');
                this.phaseTimer = 0;
            }
        } else if (this.currentPhase === 'ns-yellow' && this.phaseTimer >= yellowTime) {
            this.currentPhase = 'ew-green';
            this.setTrafficLight('ns', 'red');
            this.setTrafficLight('ew', 'green');
            this.phaseTimer = 0;
        } else if (this.currentPhase === 'ew-yellow' && this.phaseTimer >= yellowTime) {
            this.currentPhase = 'ns-green';
            this.setTrafficLight('ew', 'red');
            this.setTrafficLight('ns', 'green');
            this.phaseTimer = 0;
        }
    }

    setTrafficLight(direction, color) {
        const colors = ['red', 'yellow', 'green'];
        colors.forEach(c => {
            document.getElementById(direction + c.charAt(0).toUpperCase() + c.slice(1))
                .classList.toggle('active', c === color);
        });
    }

    spawnVehicles() {
        const spawnRate = this.settings.vehicleFrequency / 100;
        const directions = ['north', 'south', 'east', 'west'];
        const vehicleTypes = ['car', 'truck', 'bus'];

        directions.forEach(direction => {
            if (Math.random() < spawnRate) {
                const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
                const vehicle = new Vehicle(type, direction);
                this.vehicles.push(vehicle);
                this.statistics.totalVehicles++;
                document.getElementById('vehiclesContainer').appendChild(vehicle.element);
            }
        });
    }

    moveVehicles() {
        this.vehicles.forEach(vehicle => {
            let canMove = true;

            if (vehicle.isNearIntersection()) {
                if (vehicle.type === 'ambulance') {
                    canMove = true;
                } else if (vehicle.direction === 'north' || vehicle.direction === 'south') {
                    canMove = document.getElementById('nsGreen').classList.contains('active');
                } else {
                    canMove = document.getElementById('ewGreen').classList.contains('active');
                }
            }

            vehicle.move(canMove);

            if (vehicle.isWaiting) {
                this.statistics.totalWaitTime++;
            }
        });
    }

    cleanupVehicles() {
        this.vehicles = this.vehicles.filter(vehicle => {
            if (vehicle.isOutOfBounds()) {
                vehicle.element.remove();
                this.statistics.vehiclesPassed++;
                return false;
            }
            return true;
        });
    }

    updateUI() {
        document.getElementById('currentPhase').textContent = 
            this.isRunning ? this.currentPhase.toUpperCase().replace('-', ' ') : 'Stopped';
        
        document.getElementById('timer').textContent = Math.floor(this.timer / 10) + 's';

        const nsCount = this.vehicles.filter(v => 
            v.direction === 'north' || v.direction === 'south'
        ).length;
        const ewCount = this.vehicles.filter(v => 
            v.direction === 'east' || v.direction === 'west'
        ).length;

        document.getElementById('nsTraffic').textContent = nsCount;
        document.getElementById('ewTraffic').textContent = ewCount;
        document.getElementById('totalVehicles').textContent = this.statistics.totalVehicles;

        const avgWaitTime = this.statistics.totalVehicles > 0 ? 
            Math.floor((this.statistics.totalWaitTime / 10) / this.statistics.totalVehicles) : 0;
        document.getElementById('avgWaitTime').textContent = avgWaitTime + 's';

        document.getElementById('vehiclesPassed').textContent = this.statistics.vehiclesPassed;
        
        const avgSpeed = this.vehicles.length > 0 ? 
            Math.floor(this.vehicles.reduce((sum, v) => sum + v.speed, 0) / this.vehicles.length) : 0;
        document.getElementById('avgSpeed').textContent = avgSpeed;

        const queueLength = this.vehicles.filter(v => v.isWaiting).length;
        document.getElementById('queueLength').textContent = queueLength;

        const efficiency = this.statistics.totalVehicles > 0 ? 
            Math.floor((this.statistics.vehiclesPassed / this.statistics.totalVehicles) * 100) : 0;
        document.getElementById('efficiency').textContent = efficiency + '%';
    }
}

let controller;

document.addEventListener('DOMContentLoaded', function() {
    controller = new TrafficController();
    console.log('Enhanced Traffic Simulation System Initialized!');
});