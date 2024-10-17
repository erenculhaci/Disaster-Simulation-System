import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { setNodes, addNode, deleteNode } from '../store';
import L from 'leaflet';
import customMarkerIcon from '../assets/marker.png';
const customIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [20, 35],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const MapComponent = () => {
    const nodes = useSelector((state) => state.nodes);
    const dispatch = useDispatch();

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

    const getMeshConnections = () => {
        const connections = [];
        nodes.forEach((nodeA, indexA) => {
            nodes.forEach((nodeB, indexB) => {
                if (indexA !== indexB) {
                    connections.push([ [nodeA.lat, nodeA.lng], [nodeB.lat, nodeB.lng] ]);
                }
            });
        });
        return connections;
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

    const meshConnections = getMeshConnections();

    return (
        <div className="container">
            <div className="header">
                <h1>Communication Tower Network</h1>
            </div>

            <div className="button-container">
                <button className="button" onClick={handleDeleteAllNodes}>Delete All Nodes</button>
            </div>

            <div className="map-container">
                <MapContainer center={[41.0082, 28.9784]} zoom={12} style={{ height: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <MapEventHandler />
                    {/* Render mesh connections */}
                    {meshConnections.map((connection, index) => (
                        <Polyline 
                            key={index} 
                            positions={connection} 
                            color="blue" 
                            opacity={0.3} 
                            weight={1.5} 
                            dashArray="4" 
                        />
                    ))}
                    {/* Render nodes */}
                    {nodes.map((node) => (
                        <Marker key={node.id} position={[node.lat, node.lng]} icon={customIcon}>
                            <Popup>
                                <button className="popup-button" onClick={() => handleDeleteNode(node.id)}>Delete Node</button>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;
