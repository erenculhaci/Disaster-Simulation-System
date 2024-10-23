import React, { useEffect, useState, useMemo } from 'react'; 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, Circle } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import '../styles.css'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { setNodes, addNode, deleteNode } from '../store'; 
import L from 'leaflet'; 
import customMarkerIcon from '../assets/marker.png'; 
import districts_json from '../assets/istanbul-districts.json';
import * as turf from '@turf/turf';

const customIcon = L.icon({ 
    iconUrl: customMarkerIcon, 
    iconSize: [20, 35], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
}); 

const intensityDestructionRates = {
    5: 0.1,
    5.5: 0.2,
    6: 0.5,
    6.5: 0.6,
    7: 0.8,
    7.5: 1,
    8: 2,
    8.5: 3.5,
    9: 4,
    9.5: 12,
    10: 36
};

const districtDestructionRates = {
    Gaziosmanpaşa: 2.188983369,
    Ümraniye: 8.106515624,
    Sultangazi: 6.211545821,
    Kağıthane: 7.202006666,
    Çekmeköy: 5.380245381,
    Pendik: 13.47651319,
    Üsküdar: 9.537274448,
    Arnavutköy: 6.222611744,
    Sarıyer: 6.810168007,
    Sancaktepe: 10.03135831,
    Şişli: 6.201363043,
    Beykoz: 6.46862366,
    Kadıköy: 12.45537485,
    Esenyurt: 26.47537805,
    Başakşehir: 14.21813811,
    Kartal: 13.58860612,
    Maltepe: 15.01287315,
    Ataşehir: 12.14516188,
    Eyüpsultan: 14.36137706,
    Bağcılar: 25.02473731,
    Sultanbeyli: 13.87341175,
    Küçükçekmece: 31.97628065,
    Beşiktaş: 8.131196608,
    Esenler: 20.79861988,
    Avcılar: 26.30221957,
    Bahçelievler: 34.17253824,
    Beyoğlu: 16.03438815,
    Beylikdüzü: 33.52152435,
    Silivri: 18.57633344,
    Tuzla: 25.11985336,
    Şile: 4.48711571,
    Çatalca: 7.398725368,
    Fatih: 35.64738292,
    Büyükçekmece: 27.74463198,
    Bayrampaşa: 27.94482627,
    Güngören: 30.78614623,
    Zeytinburnu: 33.3375,
    Bakırköy: 45.87447699,
    Unknown: 30
};

const MapComponent = () => { 
    const nodes = useSelector((state) => state.nodes); 
    const dispatch = useDispatch(); 

    const [earthquakeIntensity, setEarthquakeIntensity] = useState(7.5);
    const [showMesh, setShowMesh] = useState(false);
    const [towerLocations, setTowerLocations] = useState([]);

    useEffect(() => { 
        const fetchNodes = async () => { 
            const response = await fetch('http://localhost:5000/api/nodes'); 
            const data = await response.json(); 
            dispatch(setNodes(data)); 
        }; 
        fetchNodes(); 
    }, [dispatch]); 

    const handleAddNode = async (lat, lng) => { 
        const response = await fetch('http://localhost:5000/api/nodes', { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ lat, lng }), 
        }); 
        const newNode = await response.json(); 
        dispatch(addNode(newNode)); 
    }; 

    const handleDeleteNode = async (id) => { 
        await fetch(`http://localhost:5000/api/nodes/${id}`, { 
            method: 'DELETE', 
        }); 
        dispatch(deleteNode(id)); 
    }; 

    const handleDeleteAllNodes = async () => { 
        await fetch('http://localhost:5000/api/nodes', { 
            method: 'DELETE', 
        }); 
        dispatch(setNodes([])); 
    }; 

    const simulateEarthquake = async () => {
        const destructionProbabilities = {};

        for (const district in districtDestructionRates) {
            const probability = intensityDestructionRates[earthquakeIntensity] * (districtDestructionRates[district] / 100);
            destructionProbabilities[district] = probability;
        }

        const nodesToDelete = nodes.filter(node => {
            const nodeDistrict = getNodeDistrict(node);
            return Math.random() < destructionProbabilities[nodeDistrict];
        });

        // Delete nodes
        for (const node of nodesToDelete) {
            await handleDeleteNode(node.id);
        }
    };

    const getNodeDistrict = (node) => {
        const point = turf.point([node.lng, node.lat]); // Create a point from the node's coordinates.
     
        for (const district of districts_json.features) {
            const coordinates = district.geometry.coordinates;
    
            // Check if the coordinates are valid for a polygon
            if (!Array.isArray(coordinates) || coordinates.length === 0) continue;
    
            // Handle MultiPolygon
            if (district.geometry.type === "MultiPolygon") {
                for (const polygon of coordinates) {
                    if (polygon.length >= 1 && polygon[0].length >= 4) {
                        const turfPolygon = turf.polygon(polygon);
                        if (turf.booleanPointInPolygon(point, turfPolygon)) {
                            return district.properties.name;
                        }
                    }
                }
            }
    
            // Handle Polygon
            if (district.geometry.type === "Polygon") {
                const polygon = coordinates;
                if (polygon.length >= 1 && polygon[0].length >= 4) {
                    const turfPolygon = turf.polygon(polygon);
                    if (turf.booleanPointInPolygon(point, turfPolygon)) {
                        return district.properties.name;
                    }
                }
            }
        }
     
        return 'Unknown'; // Return 'Unknown' if no matching district is found.
    };
    

    const toggleMeshVisibility = () => {
        setShowMesh(prevShow => !prevShow);
    };

    const getMeshConnections = () => {
        const connections = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                connections.push([[nodes[i].lat, nodes[i].lng], [nodes[j].lat, nodes[j].lng]]);
            }
        }
        return connections;
    };

    const meshConnections = useMemo(() => getMeshConnections(), [nodes]);

    const loadTowerLocations = async () => {
        try {
            // Fetch the tower locations from the JSON file
            const response = await fetch('/tower_locations.json');
            if (!response.ok) {
                throw new Error('Failed to load tower locations');
            }
            const towerLocations = await response.json();
    
            // Loop through each tower location and add it to the database
            towerLocations.forEach(async (tower) => {
                const { Latitude, Longitude } = tower;
                await handleAddNode(Latitude, Longitude);
            });
            
            console.log('All tower locations added to the database');
        } catch (error) {
            console.error('Error loading tower locations:', error);
        }
    };
    

    const MapEventHandler = () => {
        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng;
                handleAddNode(lat, lng);
            },
        });
        return null;
    };

        return (
        <div className="container">
            <div className="header">
                <h1>Communication Tower Network</h1>
            </div>

            <div className="button-container">
                <label className="label_earthquake" htmlFor="earthquake-intensity">Earthquake Intensity: </label>
                <div className="selectinput">
                    <select
                        id="earthquake-intensity"
                        className='selectinput'
                        value={earthquakeIntensity}
                        onChange={(e) => setEarthquakeIntensity(parseFloat(e.target.value))}
                    >
                        {Object.keys(intensityDestructionRates).map(intensity => (
                            <option key={intensity} value={intensity}>
                                {intensity}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="button" onClick={simulateEarthquake}>Simulate Earthquake</button>
                <button className="delete-button" onClick={handleDeleteAllNodes}>Delete All Nodes</button>
                <button className="button" onClick={loadTowerLocations}>Load Tower Locations</button>
                <button className="button" onClick={toggleMeshVisibility}>
                    {showMesh ? 'Hide Mesh Network' : 'Show Mesh Network'}
                </button>
            </div>

            <div className="map-container">
                <MapContainer center={[41.0082, 28.9784]} zoom={12} style={{ height: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <MapEventHandler />
                    
                    {/* Conditionally render the mesh connections */}
                    {showMesh && meshConnections.map((connection, index) => (
                        <Polyline
                            key={index}
                            positions={connection}
                            color="blue"
                            opacity={0.3}
                            weight={1.5}
                            dashArray="4"
                        />
                    ))}
                    
                    {nodes.map((node) => (
                        <React.Fragment key={node.id}>
                            <Marker position={[node.lat, node.lng]} icon={customIcon}>
                                <Popup>
                                    <span>Node ID: {node.id}</span>
                                    <br />
                                    <span>Latitude: {node.lat}</span>
                                    <br />
                                    <span>Longitude: {node.lng}</span>
                                    <br />
                                    <br />
                                    <span>District: {getNodeDistrict(node)}</span>
                                    <button className="popup-button" onClick={() => handleDeleteNode(node.id)}>Delete Node</button>
                                </Popup>
                            </Marker>
                            <Circle center={[node.lat, node.lng]}
                                radius={7500}
                                color="red"
                                fillOpacity={0.07}
                                weight={1} />
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent; 
