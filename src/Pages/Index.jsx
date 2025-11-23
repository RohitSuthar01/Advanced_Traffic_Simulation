import React, { useState, useEffect, useRef } from 'react';

const TrafficSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('ns-green');
  const [currentMode, setCurrentMode] = useState('normal');
  const [currentWeather, setCurrentWeather] = useState('clear');
  const [vehicles, setVehicles] = useState([]);
  const [settings, setSettings] = useState({
    greenTime: 15,
    yellowTime: 3,
    vehicleFrequency: 5
  });
  const [statistics, setStatistics] = useState({
    vehiclesPassed: 0,
    totalWaitTime: 0,
    totalVehicles: 0
  });
  const [trafficLights, setTrafficLights] = useState({
    ns: 'red',
    ew: 'red'
  });
  
  const phaseTimerRef = useRef(0);
  const vehicleIdRef = useRef(0);

  // Vehicle class logic
  const createVehicle = (type, direction) => {
    const speeds = { car: 60, truck: 45, bus: 50, ambulance: 80 };
    let speed = speeds[type] + (Math.random() * 20 - 10);
    if (currentWeather === 'rain') speed *= 0.7;
    if (currentWeather === 'fog') speed *= 0.5;

    const positions = {
      north: { x: 190, y: 450 },
      south: { x: 260, y: 0 },
      east: { x: 0, y: 190 },
      west: { x: 450, y: 260 }
    };

    return {
      id: vehicleIdRef.current++,
      type,
      direction,
      speed,
      position: { ...positions[direction] },
      waitTime: 0,
      isWaiting: false
    };
  };

  const isNearIntersection = (vehicle) => {
    const center = 225;
    const range = 120;
    const { x, y } = vehicle.position;

    switch (vehicle.direction) {
      case 'north': return y <= center + range && y >= center;
      case 'south': return y >= center - range && y <= center;
      case 'east': return x >= center - range && x <= center;
      case 'west': return x <= center + range && x >= center;
      default: return false;
    }
  };

  const isOutOfBounds = (vehicle) => {
    const { x, y } = vehicle.position;
    return x < -70 || x > 520 || y < -70 || y > 520;
  };

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimer(t => t + 1);
      phaseTimerRef.current += 1;

      // Update traffic light phase
      updateTrafficLightPhase();

      // Spawn vehicles
      spawnVehicles();

      // Move vehicles
      setVehicles(prevVehicles => {
        const updatedVehicles = prevVehicles.map(vehicle => {
          let canMove = true;

          if (isNearIntersection(vehicle)) {
            if (vehicle.type === 'ambulance') {
              canMove = true;
            } else if (vehicle.direction === 'north' || vehicle.direction === 'south') {
              canMove = trafficLights.ns === 'green';
            } else {
              canMove = trafficLights.ew === 'green';
            }
          }

          if (!canMove && isNearIntersection(vehicle)) {
            return { ...vehicle, isWaiting: true, waitTime: vehicle.waitTime + 1 };
          }

          const moveDistance = (vehicle.speed / 3600) * 100;
          const newPosition = { ...vehicle.position };

          switch (vehicle.direction) {
            case 'north': newPosition.y -= moveDistance; break;
            case 'south': newPosition.y += moveDistance; break;
            case 'east': newPosition.x += moveDistance; break;
            case 'west': newPosition.x -= moveDistance; break;
          }

          return { ...vehicle, position: newPosition, isWaiting: false };
        });

        // Update statistics
        setStatistics(prev => ({
          ...prev,
          totalWaitTime: prev.totalWaitTime + updatedVehicles.filter(v => v.isWaiting).length
        }));

        // Cleanup out of bounds vehicles
        const inBoundsVehicles = updatedVehicles.filter(vehicle => {
          if (isOutOfBounds(vehicle)) {
            setStatistics(prev => ({
              ...prev,
              vehiclesPassed: prev.vehiclesPassed + 1
            }));
            return false;
          }
          return true;
        });

        return inBoundsVehicles;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, trafficLights, currentWeather, currentMode, settings]);

  const updateTrafficLightPhase = () => {
    const greenTime = settings.greenTime * 10;
    const yellowTime = settings.yellowTime * 10;

    if (currentMode === 'smart') {
      smartTrafficControl();
      return;
    }

    const phaseTimer = phaseTimerRef.current;

    switch (currentPhase) {
      case 'ns-green':
        if (phaseTimer >= greenTime) {
          setCurrentPhase('ns-yellow');
          setTrafficLights({ ns: 'yellow', ew: 'red' });
          phaseTimerRef.current = 0;
        }
        break;
      case 'ns-yellow':
        if (phaseTimer >= yellowTime) {
          setCurrentPhase('ew-green');
          setTrafficLights({ ns: 'red', ew: 'green' });
          phaseTimerRef.current = 0;
        }
        break;
      case 'ew-green':
        if (phaseTimer >= greenTime) {
          setCurrentPhase('ew-yellow');
          setTrafficLights({ ns: 'red', ew: 'yellow' });
          phaseTimerRef.current = 0;
        }
        break;
      case 'ew-yellow':
        if (phaseTimer >= yellowTime) {
          setCurrentPhase('ns-green');
          setTrafficLights({ ns: 'green', ew: 'red' });
          phaseTimerRef.current = 0;
        }
        break;
    }
  };

  const smartTrafficControl = () => {
    const nsCount = vehicles.filter(v => 
      (v.direction === 'north' || v.direction === 'south') && isNearIntersection(v)
    ).length;
    
    const ewCount = vehicles.filter(v => 
      (v.direction === 'east' || v.direction === 'west') && isNearIntersection(v)
    ).length;

    const minGreenTime = 5 * 10;
    const yellowTime = settings.yellowTime * 10;
    const phaseTimer = phaseTimerRef.current;

    if (currentPhase === 'ns-green' && phaseTimer >= minGreenTime && ewCount > nsCount * 1.5) {
      setCurrentPhase('ns-yellow');
      setTrafficLights({ ns: 'yellow', ew: 'red' });
      phaseTimerRef.current = 0;
    } else if (currentPhase === 'ew-green' && phaseTimer >= minGreenTime && nsCount > ewCount * 1.5) {
      setCurrentPhase('ew-yellow');
      setTrafficLights({ ns: 'red', ew: 'yellow' });
      phaseTimerRef.current = 0;
    } else if (currentPhase === 'ns-yellow' && phaseTimer >= yellowTime) {
      setCurrentPhase('ew-green');
      setTrafficLights({ ns: 'red', ew: 'green' });
      phaseTimerRef.current = 0;
    } else if (currentPhase === 'ew-yellow' && phaseTimer >= yellowTime) {
      setCurrentPhase('ns-green');
      setTrafficLights({ ns: 'green', ew: 'red' });
      phaseTimerRef.current = 0;
    }
  };

  const spawnVehicles = () => {
    const spawnRate = settings.vehicleFrequency / 100;
    const directions = ['north', 'south', 'east', 'west'];
    const vehicleTypes = ['car', 'truck', 'bus'];

    directions.forEach(direction => {
      if (Math.random() < spawnRate) {
        const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        const newVehicle = createVehicle(type, direction);
        setVehicles(prev => [...prev, newVehicle]);
        setStatistics(prev => ({ ...prev, totalVehicles: prev.totalVehicles + 1 }));
      }
    });
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setCurrentPhase('ns-green');
      setTrafficLights({ ns: 'green', ew: 'red' });
      phaseTimerRef.current = 0;
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setVehicles([]);
    setTimer(0);
    phaseTimerRef.current = 0;
    setCurrentPhase('ns-green');
    setStatistics({ vehiclesPassed: 0, totalWaitTime: 0, totalVehicles: 0 });
    setTrafficLights({ ns: 'red', ew: 'red' });
  };

  const handleEmergency = () => {
    const directions = ['north', 'south', 'east', 'west'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const ambulance = createVehicle('ambulance', direction);
    setVehicles(prev => [...prev, ambulance]);
    setStatistics(prev => ({ ...prev, totalVehicles: prev.totalVehicles + 1 }));
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    if (mode === 'rush') {
      setSettings(prev => ({ ...prev, vehicleFrequency: 8 }));
    } else if (mode === 'normal') {
      setSettings(prev => ({ ...prev, vehicleFrequency: 5 }));
    }
  };

  const handleWeatherChange = (weather) => {
    setCurrentWeather(weather);
  };

  // Calculate statistics
  const nsCount = vehicles.filter(v => v.direction === 'north' || v.direction === 'south').length;
  const ewCount = vehicles.filter(v => v.direction === 'east' || v.direction === 'west').length;
  const avgWaitTime = statistics.totalVehicles > 0 ? 
    Math.floor((statistics.totalWaitTime / 10) / statistics.totalVehicles) : 0;
  const avgSpeed = vehicles.length > 0 ? 
    Math.floor(vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length) : 0;
  const queueLength = vehicles.filter(v => v.isWaiting).length;
  const efficiency = statistics.totalVehicles > 0 ? 
    Math.floor((statistics.vehiclesPassed / statistics.totalVehicles) * 100) : 0;

  const sensorActive = (direction) => {
    return vehicles.filter(v => v.direction === direction && isNearIntersection(v)).length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <style>{`
        .intersection-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }
        .road {
          background: #2d3748;
          position: absolute;
        }
        .road.vertical {
          width: 120px;
          height: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        .road.horizontal {
          height: 120px;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
        }
        .road-marking {
          background: #fbbf24;
          position: absolute;
        }
        .road.vertical .road-marking {
          width: 4px;
          height: 30px;
          left: 50%;
          transform: translateX(-50%);
        }
        .road.horizontal .road-marking {
          height: 4px;
          width: 30px;
          top: 50%;
          transform: translateY(-50%);
        }
        .vehicle {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          transition: all 0.1s linear;
        }
        .vehicle.car { background: #3b82f6; }
        .vehicle.truck { background: #ef4444; }
        .vehicle.bus { background: #10b981; }
        .vehicle.ambulance { 
          background: #f59e0b;
          animation: blink 0.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .traffic-light {
          position: absolute;
          background: #1f2937;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .traffic-light.north-south {
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
        }
        .traffic-light.east-west {
          top: 50%;
          right: 80px;
          transform: translateY(-50%);
        }
        .light {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          opacity: 0.3;
        }
        .light.red { background: #ef4444; }
        .light.yellow { background: #fbbf24; }
        .light.green { background: #10b981; }
        .light.active { opacity: 1; box-shadow: 0 0 15px currentColor; }
        .sensor {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border: 2px solid #94a3b8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }
        .sensor.active {
          background: rgba(34, 197, 94, 0.5);
          border-color: #22c55e;
          box-shadow: 0 0 20px #22c55e;
        }
        .north-sensor { top: 140px; left: 50%; transform: translateX(-50%); }
        .south-sensor { bottom: 140px; left: 50%; transform: translateX(-50%); }
        .east-sensor { right: 140px; top: 50%; transform: translateY(-50%); }
        .west-sensor { left: 140px; top: 50%; transform: translateY(-50%); }
        .weather-rain {
          filter: brightness(0.7);
        }
        .weather-night {
          filter: brightness(0.4);
        }
        .weather-fog {
          filter: blur(1px) brightness(0.9);
        }
      `}</style>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🚦 Advanced Traffic Simulation System</h1>
        <p className="text-gray-600">Advanced Real-time Traffic Management with AI-Powered Controls</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Intersection */}
        <div className="lg:col-span-2">
          <div className={`intersection-bg rounded-xl shadow-2xl ${
            currentWeather === 'rain' ? 'weather-rain' : 
            currentWeather === 'night' ? 'weather-night' : 
            currentWeather === 'fog' ? 'weather-fog' : ''
          }`} style={{ width: '100%', height: '500px', position: 'relative' }}>
            <div className="road vertical">
              {[10, 30, 50, 70, 90].map((top, i) => (
                <div key={i} className="road-marking" style={{ top: `${top}%` }}></div>
              ))}
            </div>
            <div className="road horizontal">
              {[10, 30, 50, 70, 90].map((left, i) => (
                <div key={i} className="road-marking" style={{ left: `${left}%` }}></div>
              ))}
            </div>

            {/* Vehicles */}
            {vehicles.map(vehicle => (
              <div
                key={vehicle.id}
                className={`vehicle ${vehicle.type}`}
                style={{
                  left: `${vehicle.position.x}px`,
                  top: `${vehicle.position.y}px`
                }}
              />
            ))}

            {/* Traffic Lights */}
            <div className="traffic-light north-south">
              <div className={`light red ${trafficLights.ns === 'red' ? 'active' : ''}`}></div>
              <div className={`light yellow ${trafficLights.ns === 'yellow' ? 'active' : ''}`}></div>
              <div className={`light green ${trafficLights.ns === 'green' ? 'active' : ''}`}></div>
              <div className="text-white text-xs text-center mt-1">N-S</div>
            </div>

            <div className="traffic-light east-west">
              <div className={`light red ${trafficLights.ew === 'red' ? 'active' : ''}`}></div>
              <div className={`light yellow ${trafficLights.ew === 'yellow' ? 'active' : ''}`}></div>
              <div className={`light green ${trafficLights.ew === 'green' ? 'active' : ''}`}></div>
              <div className="text-white text-xs text-center mt-1">E-W</div>
            </div>

            {/* Sensors */}
            <div className={`sensor north-sensor ${sensorActive('north') ? 'active' : ''}`}>N</div>
            <div className={`sensor south-sensor ${sensorActive('south') ? 'active' : ''}`}>S</div>
            <div className={`sensor east-sensor ${sensorActive('east') ? 'active' : ''}`}>E</div>
            <div className={`sensor west-sensor ${sensorActive('west') ? 'active' : ''}`}>W</div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🎮 Control Panel</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                ▶ Start
              </button>
              <button onClick={handleStop} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold">
                ⏸ Pause
              </button>
              <button onClick={handleReset} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold">
                🔄 Reset
              </button>
              <button onClick={handleEmergency} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold">
                🚑 Emergency
              </button>
            </div>

            <h4 className="font-semibold mb-2">🎚️ Traffic Mode</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['normal', 'rush', 'smart', 'manual'].map(mode => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`px-3 py-2 rounded-lg font-medium capitalize ${
                    currentMode === mode ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Green Duration: {settings.greenTime}s</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={settings.greenTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, greenTime: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yellow Duration: {settings.yellowTime}s</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={settings.yellowTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, yellowTime: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Spawn Rate: {settings.vehicleFrequency}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.vehicleFrequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, vehicleFrequency: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 System Status</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Phase:</span> {isRunning ? currentPhase.toUpperCase().replace('-', ' ') : 'Stopped'}</div>
              <div><span className="font-medium">Timer:</span> {Math.floor(timer / 10)}s</div>
              <div><span className="font-medium">N-S Traffic:</span> {nsCount}</div>
              <div><span className="font-medium">E-W Traffic:</span> {ewCount}</div>
              <div><span className="font-medium">Total:</span> {statistics.totalVehicles}</div>
              <div><span className="font-medium">Avg Wait:</span> {avgWaitTime}s</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">🌤️ Weather Conditions</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'clear', icon: '☀️', label: 'Clear' },
            { id: 'rain', icon: '🌧️', label: 'Rain' },
            { id: 'night', icon: '🌙', label: 'Night' },
            { id: 'fog', icon: '🌫️', label: 'Fog' }
          ].map(weather => (
            <button
              key={weather.id}
              onClick={() => handleWeatherChange(weather.id)}
              className={`px-4 py-3 rounded-lg font-medium ${
                currentWeather === weather.id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {weather.icon} {weather.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '🚗 Vehicles Passed', value: statistics.vehiclesPassed },
          { label: '⚡ Average Speed', value: avgSpeed },
          { label: '⏱️ Queue Length', value: queueLength },
          { label: '✨ Efficiency', value: `${efficiency}%` }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h4 className="text-gray-600 mb-2">{stat.label}</h4>
            <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
          </div>
        ))}
      </div>

      <footer className="text-center mt-8 text-gray-600">
        <p>© 2024 Enhanced Traffic Simulation System - Advanced Real-time Traffic Management with AI</p>
      </footer>
    </div>
  );
};

export default TrafficSimulation;