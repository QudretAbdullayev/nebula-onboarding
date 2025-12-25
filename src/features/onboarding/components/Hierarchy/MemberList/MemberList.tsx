import styles from './MemberList.module.scss';

export interface Member {
    id: number;
    originalId?: string | number; // Added to carry the original ID if it's a string/number mix
    name: string;
    position: string;
    avatar?: string;
    initial?: string;
    color?: string;
    percentage?: number;
    rank?: number;
}

interface MembersListProps {
    nodeId?: string; // ID of the node this list belongs to
    members?: Member[];
    showPercentage?: boolean;
    onClose?: () => void;
}

export const MembersList = ({ members, showPercentage = false, nodeId }: MembersListProps) => {
    const defaultMembers: Member[] = [
        {
            id: 1,
            name: 'Kaylynn Gouse',
            position: 'Product designer',
            avatar: '/avatar1.jpg',
            percentage: 97.25,
            rank: 1,
        },
        // ... (other default members would go here, but omitted for brevity in this view, 
        // relying on props mostly anyway for real data)
    ];

    const membersList = members || defaultMembers;

    const handleDragStart = (e: React.DragEvent, member: Member) => {
        if (!nodeId) return;

        // Use originalId if present (from Card mapping), otherwise id
        const memberId = member.originalId !== undefined ? member.originalId : member.id;

        e.dataTransfer.setData('application/json', JSON.stringify({
            memberId: memberId,
            sourceNodeId: nodeId
        }));
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className={styles.list}>
            {membersList.map((member) => (
                <div
                    key={member.id}
                    className={styles.list__item}
                    draggable={!!nodeId}
                    onDragStart={(e) => handleDragStart(e, member)}
                    style={nodeId ? { cursor: 'grab' } : undefined}
                >
                    {member.rank && (
                        <span className={styles.list__rank}>{member.rank}</span>
                    )}

                    <div className={styles.list__profile}>
                        <div
                            className={styles.list__avatar}
                            style={!member.avatar && member.color ? { backgroundColor: member.color } : undefined}
                        >
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} />
                            ) : (
                                <span>{member.initial}</span>
                            )}
                        </div>

                        <div className={styles.list__info}>
                            <span className={styles.list__name}>{member.name}</span>
                            <span className={styles.list__position}>{member.position}</span>
                        </div>
                    </div>

                    {showPercentage && member.percentage && (
                        <span className={styles.list__percentage}>
                            {member.percentage}%
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MembersList;