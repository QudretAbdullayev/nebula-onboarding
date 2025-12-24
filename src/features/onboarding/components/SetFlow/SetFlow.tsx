import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import styles from './SetFlow.module.scss';
import { Card, type EmployeeData, type TeamMember } from './Card/Card';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

// Tree node interface
interface TreeNode {
    id: string;
    data: EmployeeData;
    children: TreeNode[];
    parent?: TreeNode;
}

interface SetFlowProps {
    onNext?: () => void;
    onBack?: () => void;
}

// Constants for layout
const CARD_WIDTH = 260;
const CARD_HEIGHT = 138;
const HORIZONTAL_GAP = 60;
const VERTICAL_GAP = 100;
const CONNECTOR_OFFSET = 50;

// Calculate tree layout positions
const calculateLayout = (
    node: TreeNode,
    depth: number = 0,
    positions: Map<string, { x: number; y: number }> = new Map()
): { width: number; positions: Map<string, { x: number; y: number }> } => {
    const y = depth * (CARD_HEIGHT + VERTICAL_GAP);

    if (node.children.length === 0) {
        positions.set(node.id, { x: 0, y });
        return { width: CARD_WIDTH, positions };
    }

    // Calculate children layouts
    const childResults = node.children.map(child =>
        calculateLayout(child, depth + 1)
    );

    // Total width of all children
    const totalChildWidth = childResults.reduce((sum, result, index) => {
        return sum + result.width + (index > 0 ? HORIZONTAL_GAP : 0);
    }, 0);

    // Position children
    let currentX = -totalChildWidth / 2;
    childResults.forEach((result) => {
        const childWidth = result.width;
        const childCenterX = currentX + childWidth / 2;

        result.positions.forEach((pos, id) => {
            positions.set(id, {
                x: pos.x + childCenterX,
                y: pos.y
            });
        });

        currentX += childWidth + HORIZONTAL_GAP;
    });

    // Position this node at center
    positions.set(node.id, { x: 0, y });

    return { width: Math.max(CARD_WIDTH, totalChildWidth), positions };
};

// Generate SVG path for connections with rounded corners
const generateConnectionPath = (
    parentX: number,
    parentY: number,
    childX: number,
    childY: number
): string => {
    const startY = parentY + CARD_HEIGHT;
    const endY = childY;
    const midY = startY + CONNECTOR_OFFSET;
    const radius = 20; // Corner radius
    
    // Direction: 1 for right, -1 for left
    const direction = childX > parentX ? 1 : childX < parentX ? -1 : 0;
    
    if (direction === 0) {
        // Straight line down
        return `M ${parentX} ${startY} L ${parentX} ${endY}`;
    }
    
    // Path with rounded corners
    // Start from parent, go down, curve horizontally, go to child X, curve down, go to child
    return `M ${parentX} ${startY} 
            L ${parentX} ${midY - radius}
            Q ${parentX} ${midY} ${parentX + (radius * direction)} ${midY}
            L ${childX - (radius * direction)} ${midY}
            Q ${childX} ${midY} ${childX} ${midY + radius}
            L ${childX} ${endY}`;
};

// Deep clone tree without circular references
const cloneTree = (node: TreeNode, parent?: TreeNode): TreeNode => {
    const cloned: TreeNode = {
        id: node.id,
        data: { ...node.data },
        children: [],
        parent,
    };
    cloned.children = node.children.map(child => cloneTree(child, cloned));
    return cloned;
};

// Flatten tree to array
const flattenTree = (node: TreeNode, result: TreeNode[] = []): TreeNode[] => {
    result.push(node);
    node.children.forEach(child => flattenTree(child, result));
    return result;
};

// Get all connections
const getConnections = (node: TreeNode, connections: { parent: string; child: string }[] = []): { parent: string; child: string }[] => {
    node.children.forEach(child => {
        connections.push({ parent: node.id, child: child.id });
        getConnections(child, connections);
    });
    return connections;
};

// Initial data creator (without handlers - will be added later)
const createInitialData = (): TreeNode => {
    const team1: TeamMember[] = [
        { color: '#FFA500', image: '/users/user-1.jpg', initial: 'JD', name: 'John Doe', position: 'Marketing Manager' },
        { color: '#6F61FF', initial: 'AG', name: 'Anna Green', position: 'Content Specialist' },
        { color: '#6F61FF', initial: 'KG', name: 'Kevin Gray', position: 'SEO Specialist' },
        { color: '#409B3F', initial: 'NG', name: 'Nina Gold', position: 'Social Media Manager' },
        { color: '#F83CE9', image: '/users/user-5.jpg', initial: 'SM', name: 'Sarah Miller', position: 'Brand Manager' },
    ];

    const team2: TeamMember[] = [
        { color: '#FFA500', initial: 'AB', name: 'Alex Brown', position: 'Product Manager' },
        { color: '#6F61FF', initial: 'MK', name: 'Mike Kelly', position: 'Developer' },
        { color: '#6F61FF', initial: 'LT', name: 'Lisa Turner', position: 'Designer' },
        { color: '#409B3F', initial: 'B', name: 'Bob Smith', position: 'Analyst' },
        { color: '#F83CE9', initial: 'EJ', name: 'Emma Jones', position: 'QA Engineer' },
    ];

    const team3: TeamMember[] = [
        { color: '#FFA500', initial: 'AB', name: 'Amanda Baker', position: 'Team Lead' },
        { color: '#6F61FF', image: '/users/user-1.jpg', initial: 'JW', name: 'Jack Wilson', position: 'Developer' },
        { color: '#6F61FF', initial: 'IG', name: 'Ivan Garcia', position: 'Backend Developer' },
        { color: '#409B3F', initial: 'SS', name: 'Sophie Stone', position: 'Frontend Developer' },
        { color: '#F83CE9', image: '/users/user-6.jpg', initial: 'RH', name: 'Rachel Harris', position: 'UX Designer' },
        { color: '#F83CE9', image: '/users/user-5.jpg', initial: 'TM', name: 'Tom Martin', position: 'DevOps' },
        { color: '#F83CE9', image: '/users/user-7.jpg', initial: 'NC', name: 'Nancy Clark', position: 'Scrum Master' },
        { color: '#F83CE9', image: '/users/user-8.jpg', initial: 'PL', name: 'Peter Lewis', position: 'Product Owner' },
    ];

    const node4: TreeNode = {
        id: '4',
        data: {
            id: '4',
            title: 'Growth',
            name: 'Boolod',
            position: 'Senior Product Owner',
            initial: 'AA',
            team: team2,
        },
        children: [],
    };

    const node5: TreeNode = {
        id: '5',
        data: {
            id: '5',
            title: 'Growth',
            name: 'Boolod',
            position: 'Senior Product Owner',
            initial: 'AA',
            team: team3,
        },
        children: [],
    };

    const node2: TreeNode = {
        id: '2',
        data: {
            id: '2',
            title: 'Growth',
            name: 'Kartr Brian',
            position: 'Senior Product Owner',
            initial: 'AA',
        },
        children: [node4, node5],
    };
    node4.parent = node2;
    node5.parent = node2;

    const node3: TreeNode = {
        id: '3',
        data: {
            id: '3',
            title: 'Marketing',
            name: 'Ceysi Brian',
            position: 'Head of Marketing',
            initial: 'AA',
            team: team1,
        },
        children: [],
    };

    const root: TreeNode = {
        id: '1',
        data: {
            id: '1',
            title: 'Company Name',
            name: 'Anton Brian',
            position: 'CEO & Founder',
            initial: 'AA',
            isCompany: true,
        },
        children: [node2, node3],
    };
    node2.parent = root;
    node3.parent = root;

    return root;
};

export const SetFlow = ({ onNext, onBack }: SetFlowProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    
    const [scale, setScale] = useState(0.85);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // State must be declared before the callback that uses it
    const [tree, setTree] = useState<TreeNode>(() => createInitialData());

    // Ref to hold the latest handler
    const handleAddSubdepartmentRef = useRef<(id: string) => void>(() => {});

    const handleAddSubdepartment = useCallback((parentId: string) => {
        setTree(currentTree => {
            const newTree = cloneTree(currentTree);
            
            const findNode = (node: TreeNode): TreeNode | null => {
                if (node.id === parentId) return node;
                for (const child of node.children) {
                    const found = findNode(child);
                    if (found) return found;
                }
                return null;
            };

            const parent = findNode(newTree);
            if (parent) {
                const newId = `${Date.now()}`;
                const newNode: TreeNode = {
                    id: newId,
                    data: {
                        id: newId,
                        title: 'New Department',
                        name: 'New Employee',
                        position: 'Position',
                        initial: 'NE',
                        onAddSubdepartment: (id: string) => handleAddSubdepartmentRef.current(id),
                    },
                    children: [],
                    parent,
                };
                parent.children.push(newNode);
            }

            return newTree;
        });
    }, []);

    // Keep ref updated
    useEffect(() => {
        handleAddSubdepartmentRef.current = handleAddSubdepartment;
    }, [handleAddSubdepartment]);

    // Prevent page zoom when using wheel on this component
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventZoom = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };

        // Prevent pinch zoom on touch devices
        const preventTouchZoom = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        container.addEventListener('wheel', preventZoom, { passive: false });
        container.addEventListener('touchmove', preventTouchZoom, { passive: false });

        return () => {
            container.removeEventListener('wheel', preventZoom);
            container.removeEventListener('touchmove', preventTouchZoom);
        };
    }, []);

    // Calculate positions
    const { positions, connections, bounds } = useMemo(() => {
        // Update handlers on all nodes (inline recursive function)
        const updateHandlers = (node: TreeNode) => {
            node.data.onAddSubdepartment = (id: string) => handleAddSubdepartmentRef.current(id);
            node.children.forEach(updateHandlers);
        };
        updateHandlers(tree);
        const { positions } = calculateLayout(tree);
        const connections = getConnections(tree);

        // Calculate bounds
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        positions.forEach(pos => {
            minX = Math.min(minX, pos.x - CARD_WIDTH / 2);
            maxX = Math.max(maxX, pos.x + CARD_WIDTH / 2);
            minY = Math.min(minY, pos.y);
            maxY = Math.max(maxY, pos.y + CARD_HEIGHT);
        });

        return {
            positions,
            connections,
            bounds: { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY }
        };
    }, [tree]);

    // Pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === containerRef.current || e.target === contentRef.current) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Mouse wheel zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        // Don't zoom if clicking on a card (popup might be open)
        const target = e.target as HTMLElement;
        if (target.closest(`.${styles.hierarchy__card}`)) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // Zoom sensitivity (lower = less sensitive)
        const zoomSensitivity = 0.02;
        const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
        
        setScale(s => {
            const newScale = s + delta;
            return Math.min(Math.max(newScale, 0.3), 2);
        });
    }, []);

    const handleZoomIn = () => {
        setScale(s => Math.min(s + 0.1, 2));
    };

    const handleZoomOut = () => {
        setScale(s => Math.max(s - 0.1, 0.3));
    };

    const nodes = flattenTree(tree);

    // Center offset
    const centerX = bounds.width / 2 + bounds.minX;

    return (
        <div className={styles.hierarchy}>
            <div className={styles.hierarchy__blur} />
            <div className={styles.hierarchy__blur2} />

            <Header onBack={onBack} />

            <div
                ref={containerRef}
                className={styles.hierarchy__content}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <div
                    ref={contentRef}
                    className={styles.hierarchy__canvas}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    {/* SVG for connection lines */}
                    <svg
                        className={styles.hierarchy__lines}
                        style={{
                            width: bounds.width + 100,
                            height: bounds.height + 200,
                            left: '50%',
                            marginLeft: -(bounds.width + 100) / 2 - centerX,
                            top: 0,
                        }}
                    >
                        {/* Draw connection lines */}
                        {connections.map(({ parent, child }) => {
                            const parentPos = positions.get(parent);
                            const childPos = positions.get(child);
                            if (!parentPos || !childPos) return null;

                            const offsetX = (bounds.width + 100) / 2 + centerX;
                            const path = generateConnectionPath(
                                parentPos.x + offsetX,
                                parentPos.y,
                                childPos.x + offsetX,
                                childPos.y
                            );

                            return (
                                <path
                                    key={`${parent}-${child}`}
                                    d={path}
                                    fill="none"
                                    stroke="#561CCE"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>

                    {/* Cards */}
                    {nodes.map(node => {
                        const pos = positions.get(node.id);
                        if (!pos) return null;

                        return (
                            <div
                                key={node.id}
                                className={styles.hierarchy__card}
                                style={{
                                    left: `calc(50% + ${pos.x - CARD_WIDTH / 2 - centerX}px)`,
                                    top: pos.y,
                                }}
                            >
                                <Card data={node.data} />
                            </div>
                        );
                    })}

                    {/* Dots at the top of child nodes - rendered after cards to be on top */}
                    {connections.map(({ child }) => {
                        const childPos = positions.get(child);
                        if (!childPos) return null;

                        return (
                            <div
                                key={`dot-${child}`}
                                className={styles.hierarchy__dot}
                                style={{
                                    left: `calc(50% + ${childPos.x - centerX}px)`,
                                    top: childPos.y,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <Footer onNext={onNext} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </div>
    );
};

export default SetFlow;