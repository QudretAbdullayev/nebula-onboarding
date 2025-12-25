import styles from './MemberList.module.scss';

export interface Member {
    id: number;
    originalId?: string | number;
    name: string;
    position: string;
    avatar?: string;
    initial?: string;
    color?: string;
    percentage?: number;
    rank?: number;
}

interface MembersListProps {
    nodeId?: string;
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

        const memberId = member.originalId !== undefined ? member.originalId : member.id;

        e.dataTransfer.setData('application/json', JSON.stringify({
            memberId: memberId,
            sourceNodeId: nodeId
        }));
        e.dataTransfer.effectAllowed = 'move';

        // Set custom drag image (only the avatar)
        const target = e.currentTarget as HTMLElement;
        const avatarEl = target.querySelector(`.${styles.list__avatar}`) as HTMLElement;

        if (avatarEl) {
            // Create a clone to ensure we have full control over the visual
            const clone = avatarEl.cloneNode(true) as HTMLElement;

            // Apply explicit styles to the clone to ensure it looks right
            clone.style.width = '32px';
            clone.style.height = '32px';
            clone.style.borderRadius = '50%'; // Force circle
            clone.style.overflow = 'hidden';
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            clone.style.left = '-9999px';
            clone.style.zIndex = '9999';
            clone.style.backgroundColor = avatarEl.style.backgroundColor || 'transparent';

            // Ensure image inside (if any) fits correctly
            const img = clone.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
            }

            document.body.appendChild(clone);

            // setDragImage
            e.dataTransfer.setDragImage(clone, 16, 16); // Center (32/2)

            // Cleanup
            requestAnimationFrame(() => {
                document.body.removeChild(clone);
            });
        }
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