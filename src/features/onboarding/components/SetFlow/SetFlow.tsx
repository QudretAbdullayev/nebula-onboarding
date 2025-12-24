import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import type {
    Node,
    Edge,
    Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styles from './SetFlow.module.scss';
import { Card, type EmployeeData } from './Card/Card';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

// Node types
const nodeTypes = {
    employeeNode: Card,
};

interface SetFlowProps {
    onNext?: () => void;
    onBack?: () => void;
}

const CARD_WIDTH = 300;
const HORIZONTAL_SPACING = 50;
const VERTICAL_SPACING = 280;

const FlowContent = ({ onNext, onBack }: SetFlowProps) => {
    const { zoomIn, zoomOut } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState<EmployeeData>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const handleAddSubdepartmentRef = useRef<(id: number) => void>(() => {});

    const calculateTreeLayout = useCallback((
        nodeId: string,
        currentNodes: Node<EmployeeData>[],
        currentEdges: Edge[],
        x: number,
        y: number,
        visited = new Set<string>()
    ): { width: number; positions: Map<string, { x: number; y: number }> } => {
        if (visited.has(nodeId)) {
            return { width: CARD_WIDTH, positions: new Map() };
        }
        visited.add(nodeId);

        const positions = new Map<string, { x: number; y: number }>();
        
        const children = currentEdges
            .filter(edge => edge.source === nodeId)
            .map(edge => edge.target);

        if (children.length === 0) {
            positions.set(nodeId, { x, y });
            return { width: CARD_WIDTH, positions };
        }

        const childResults = children.map(childId => 
            calculateTreeLayout(childId, currentNodes, currentEdges, 0, y + VERTICAL_SPACING, visited)
        );

        const totalWidth = childResults.reduce((sum, result, index) => {
            return sum + result.width + (index > 0 ? HORIZONTAL_SPACING : 0);
        }, 0);

        let currentX = x - totalWidth / 2;
        childResults.forEach((result) => {
            const childWidth = result.width;
            const childCenterX = currentX + childWidth / 2;

            result.positions.forEach((pos, id) => {
                positions.set(id, {
                    x: pos.x + childCenterX,
                    y: pos.y
                });
            });

            currentX += childWidth + HORIZONTAL_SPACING;
        });

        positions.set(nodeId, { x, y });

        return { width: totalWidth, positions };
    }, []);

    const relayoutTree = useCallback((
        currentNodes: Node<EmployeeData>[],
        currentEdges: Edge[],
        rootId: string = '1'
    ) => {
        const { positions } = calculateTreeLayout(
            rootId,
            currentNodes,
            currentEdges,
            500,
            50
        );

        return currentNodes.map(node => ({
            ...node,
            position: positions.get(node.id) || node.position
        }));
    }, [calculateTreeLayout]);

    const handleAddSubdepartment = useCallback((employeeId: number) => {
        setNodes(currentNodes => {
            setEdges(currentEdges => {
                const parentNode = currentNodes.find((n) => n.data.id === employeeId);
                
                if (!parentNode) return currentEdges;

                const newId = `${Date.now()}`;

                const newNode: Node<EmployeeData> = {
                    id: newId,
                    type: 'employeeNode',
                    position: { x: 0, y: 0 },
                    data: {
                        id: parseInt(newId),
                        title: 'New Department',
                        name: 'New Employee',
                        position: 'Position',
                        initial: 'NE',
                        onAddSubdepartment: (id: number) => handleAddSubdepartmentRef.current(id),
                    },
                };

                const newEdge: Edge = {
                    id: `e${parentNode.id}-${newId}`,
                    source: parentNode.id,
                    target: newId,
                    type: 'default',
                    animated: false,
                    style: {
                        stroke: '#561CCE',
                        strokeWidth: 2,
                    },
                };

                const updatedNodes = [...currentNodes, newNode];
                const updatedEdges = [...currentEdges, newEdge];
                
                const layoutedNodes = relayoutTree(updatedNodes, updatedEdges);
                
                setTimeout(() => {
                    setNodes(layoutedNodes);
                }, 0);

                return updatedEdges;
            });

            return currentNodes;
        });
    }, [relayoutTree, setNodes, setEdges]);

    useEffect(() => {
        handleAddSubdepartmentRef.current = handleAddSubdepartment;
    }, [handleAddSubdepartment]);

    useEffect(() => {
        const initialNodes: Node<EmployeeData>[] = [
            {
                id: '1',
                type: 'employeeNode',
                position: { x: 500, y: 50 },
                data: {
                    id: 1,
                    title: 'Company Name',
                    name: 'Anton Brian',
                    position: 'CEO & Founder',
                    initial: 'AA',
                    isCompany: true,
                    onAddSubdepartment: (id: number) => handleAddSubdepartmentRef.current(id),
                },
            },
            {
                id: '2',
                type: 'employeeNode',
                position: { x: 200, y: 330 },
                data: {
                    id: 2,
                    title: 'Growth',
                    name: 'Kartr Brian',
                    position: 'Senior Product Owner',
                    initial: 'AA',
                    onAddSubdepartment: (id: number) => handleAddSubdepartmentRef.current(id),
                },
            },
            {
                id: '3',
                type: 'employeeNode',
                position: { x: 800, y: 330 },
                data: {
                    id: 3,
                    title: 'Marketing',
                    name: 'Ceysi Brian',
                    position: 'Head of Marketing',
                    initial: 'AA',
                    onAddSubdepartment: (id: number) => handleAddSubdepartmentRef.current(id),
                    team: [
                        { color: '#FFA500', image: '/public/users/user-1.jpg', initial: 'JD', name: 'John Doe', position: 'Marketing Manager' },
                        { color: '#6F61FF', initial: 'AG', name: 'Anna Green', position: 'Content Specialist' },
                        { color: '#6F61FF', initial: 'KG', name: 'Kevin Gray', position: 'SEO Specialist' },
                        { color: '#409B3F', initial: 'NG', name: 'Nina Gold', position: 'Social Media Manager' },
                        { color: '#F83CE9', image: '/public/users/user-5.jpg', initial: 'SM', name: 'Sarah Miller', position: 'Brand Manager' },
                    ],
                },
            },
            {
                id: '4',
                type: 'employeeNode',
                position: { x: 50, y: 610 },
                data: {
                    id: 4,
                    title: 'Growth',
                    name: 'Boolod',
                    position: 'Senior Product Owner',
                    initial: 'AA',
                    onAddSubdepartment: (id: number) => handleAddSubdepartmentRef.current(id),
                    team: [
                        { color: '#FFA500', image: null, initial: 'AB', name: 'Alex Brown', position: 'Product Manager' },
                        { color: '#6F61FF', initial: 'MK', name: 'Mike Kelly', position: 'Developer' },
                        { color: '#6F61FF', image: '/user.svg', initial: 'LT', name: 'Lisa Turner', position: 'Designer' },
                        { color: '#409B3F', initial: 'B', name: 'Bob Smith', position: 'Analyst' },
                        { color: '#F83CE9', image: '/user.svg', initial: 'EJ', name: 'Emma Jones', position: 'QA Engineer' },
                    ],
                },
            },
            {
                id: '5',
                type: 'employeeNode',
                position: { x: 350, y: 610 },
                data: {
                    id: 5,
                    title: 'Growth',
                    name: 'Boolod',
                    position: 'Senior Product Owner',
                    initial: 'AA',
                    onAddSubdepartment: (id: number) => handleAddSubdepartmentRef.current(id),
                    team: [
                        { color: '#FFA500', initial: 'AB', name: 'Amanda Baker', position: 'Team Lead' },
                        { color: '#6F61FF', image: "/public/users/user-1.jpg", initial: 'JW', name: 'Jack Wilson', position: 'Developer' },
                        { color: '#6F61FF', initial: "IG", name: 'Ivan Garcia', position: 'Backend Developer' },
                        { color: '#409B3F', initial: 'SS', name: 'Sophie Stone', position: 'Frontend Developer' },
                        { color: '#F83CE9', image: '/public/users/user-6.jpg', initial: 'RH', name: 'Rachel Harris', position: 'UX Designer'},
                        { color: '#F83CE9', image: '/public/users/user-5.jpg', initial: 'TM', name: 'Tom Martin', position: 'DevOps' },
                        { color: '#F83CE9', image: '/public/users/user-7.jpg', initial: 'NC', name: 'Nancy Clark', position: 'Scrum Master'},
                        { color: '#F83CE9', image: '/public/users/user-8.jpg', initial: 'PL', name: 'Peter Lewis', position: 'Product Owner'},
                    ],
                },
            },
        ];

        const initialEdges: Edge[] = [
            {
                id: 'e1-2',
                source: '1',
                target: '2',
                type: 'default',
                animated: false,
                style: { stroke: '#561CCE', strokeWidth: 2 },
            },
            {
                id: 'e1-3',
                source: '1',
                target: '3',
                type: 'default',
                animated: false,
                style: { stroke: '#561CCE', strokeWidth: 2 },
            },
            {
                id: 'e2-4',
                source: '2',
                target: '4',
                type: 'default',
                animated: false,
                style: { stroke: '#561CCE', strokeWidth: 2 },
            },
            {
                id: 'e2-5',
                source: '2',
                target: '5',
                type: 'default',
                animated: false,
                style: { stroke: '#561CCE', strokeWidth: 2 },
            },
        ];

        const layoutedNodes = relayoutTree(initialNodes, initialEdges);
        setNodes(layoutedNodes);
        setEdges(initialEdges);
    }, [relayoutTree, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({
            ...params,
            type: 'default',
            animated: false,
            style: { stroke: '#561CCE', strokeWidth: 2 },
        }, eds)),
        [setEdges]
    );

    return (
        <div className={styles.hierarchy}>
            <div className={styles.hierarchy__blur} />
            <div className={styles.hierarchy__blur2} />

            <Header onBack={onBack} />

            <div className={styles.hierarchy__content}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    fitView
                    minZoom={0.3}
                    maxZoom={2}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background color="#E5E5E5" gap={16} size={1} />
                </ReactFlow>
            </div>

            <Footer onNext={onNext} onZoomIn={zoomIn} onZoomOut={zoomOut} />
        </div>
    );
};

export const SetFlow = (props: SetFlowProps) => {
    return (
        <ReactFlowProvider>
            <FlowContent {...props} />
        </ReactFlowProvider>
    );
};