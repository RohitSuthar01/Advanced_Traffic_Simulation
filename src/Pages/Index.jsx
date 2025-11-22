import React from 'react'
import "../assets/style.css"
import "../assets/script.js"

const Index = () => {
    return (
        
            <div className="container">
                <header>
                    <h1>🚦 Advanced Traffic Simulation System</h1>
                    <p>Advanced Real-time Traffic Management with AI-Powered Controls</p>
                </header>

                <div className="main-grid">
                    <div className="intersection-container">
                        <div className="intersection" id="intersection">
                            <div className="road vertical"> 
                                <div className="road-marking" style={{top: '10%'}}></div>
                                <div className="road-marking" style={{top: '30%'}}></div>
                                <div className="road-marking" style={{top: '50%'}}></div>
                                <div className="road-marking" style={{top: '70%'}}></div>
                                <div className="road-marking" style={{top: '90%'}}></div>
                            </div>
                            <div className="road horizontal">
                                <div className="road-marking" style={{left: '10%'}}></div>
                                <div className="road-marking" style={{left: '30%'}}></div>
                                <div className="road-marking" style={{left: '50%'}}></div>
                                <div className="road-marking" style={{left: '70%'}}></div>
                                <div className="road-marking" style={{left: '90%'}}></div>
                            </div>

                            <div className="vehicles-container" id="vehiclesContainer"></div>

                            <div className="traffic-light north-south" id="nsTrafficLight">
                                <div className="light red" id="nsRed"></div>
                                <div className="light yellow" id="nsYellow"></div>
                                <div className="light green" id="nsGreen"></div>
                                <div className="direction-label">N-S</div>
                            </div>

                            <div className="traffic-light east-west" id="ewTrafficLight">
                                <div className="light red" id="ewRed"></div>
                                <div className="light yellow" id="ewYellow"></div>
                                <div className="light green" id="ewGreen"></div>
                                <div className="direction-label">E-W</div>
                            </div>

                            <div className="sensor north-sensor" id="northSensor">
                                <div className="sensor-indicator"></div>
                                <span>N</span>
                            </div>
                            <div className="sensor south-sensor" id="southSensor">
                                <div className="sensor-indicator"></div>
                                <span>S</span>
                            </div>
                            <div className="sensor east-sensor" id="eastSensor">
                                <div className="sensor-indicator"></div>
                                <span>E</span>
                            </div>
                            <div className="sensor west-sensor" id="westSensor">
                                <div className="sensor-indicator"></div>
                                <span>W</span>
                            </div>
                        </div>
                    </div>

                    <div className="controls-grid">
                        <div className="panel">
                            <h3>🎮 Control Panel</h3>
                            <div className="controls">
                                <button id="startBtn" className="btn primary">▶ Start</button>
                                <button id="stopBtn" className="btn secondary">⏸ Pause</button>
                                <button id="resetBtn" className="btn warning">🔄 Reset</button>
                                <button id="emergencyBtn" className="btn info">🚑 Emergency</button>
                            </div>

                            <h4 style={{margin: '20px 0 15px', color: '#4a5568'}}>🎚️ Traffic Mode</h4>
                            <div className="mode-selector">
                                <div className="mode-btn active" data-mode="normal">Normal</div>
                                <div className="mode-btn" data-mode="rush">Rush Hour</div>
                                <div className="mode-btn" data-mode="smart">Smart AI</div>
                                <div className="mode-btn" data-mode="manual">Manual</div>
                            </div>

                            <h4 style={{margin: '20px 0 15px', color: '#4a5568'}}>⚙️ Timing Settings</h4>
                            <div className="setting-group">
                                <label>Green Duration:</label>
                                <input type="range" id="greenTime" min="5" max="30" value="15" />
                                    <span id="greenTimeValue">15s</span>
                            </div>
                            <div className="setting-group">
                                <label>Yellow Duration:</label>
                                <input type="range" id="yellowTime" min="2" max="8" value="3" />
                                    <span id="yellowTimeValue">3s</span>
                            </div>
                            <div className="setting-group">
                                <label>Vehicle Spawn Rate:</label>
                                <input type="range" id="vehicleFreq" min="1" max="10" value="5" />
                                    <span id="vehicleFreqValue">5</span>
                            </div>
                        </div>

                        <div className="panel">
                            <h3>📊 System Status</h3>
                            <div className="status-grid">
                                <div className="status-item">
                                    <span className="label">Current Phase</span>
                                    <div className="value" id="currentPhase">Stopped</div>
                                </div>
                                <div className="status-item">
                                    <span className="label">Timer</span>
                                    <div className="value" id="timer">0s</div>
                                </div>
                                <div className="status-item">
                                    <span className="label">N-S Traffic</span>
                                    <div className="value" id="nsTraffic">0</div>
                                </div>
                                <div className="status-item">
                                    <span className="label">E-W Traffic</span>
                                    <div className="value" id="ewTraffic">0</div>
                                </div>
                                <div className="status-item">
                                    <span className="label">Total Vehicles</span>
                                    <div className="value" id="totalVehicles">0</div>
                                </div>
                                <div className="status-item">
                                    <span className="label">Avg Wait Time</span>
                                    <div className="value" id="avgWaitTime">0s</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="weather-panel">
                    <h3 style={{marginBottom: '15px', color: '#2d3748'}}>🌤️ Weather Conditions</h3>
                    <div className="weather-grid">
                        <div className="weather-btn active" data-weather="clear">☀️ Clear</div>
                        <div className="weather-btn" data-weather="rain">🌧️ Rain</div>
                        <div className="weather-btn" data-weather="night">🌙 Night</div>
                        <div className="weather-btn" data-weather="fog">🌫️ Fog</div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>🚗 Vehicles Passed</h4>
                        <div className="stat-value" id="vehiclesPassed">0</div>
                    </div>
                    <div className="stat-card">
                        <h4>⚡ Average Speed</h4>
                        <div className="stat-value" id="avgSpeed">0</div>
                    </div>
                    <div className="stat-card">
                        <h4>⏱️ Queue Length</h4>
                        <div className="stat-value" id="queueLength">0</div>
                    </div>
                    <div className="stat-card">
                        <h4>✨ Efficiency</h4>
                        <div className="stat-value" id="efficiency">0%</div>
                    </div>
                </div>

                <footer>
                    <p>© 2024 Enhanced Traffic Simulation System - Advanced Real-time Traffic Management with AI</p>
                </footer>
            </div>
    )
}

export default Index