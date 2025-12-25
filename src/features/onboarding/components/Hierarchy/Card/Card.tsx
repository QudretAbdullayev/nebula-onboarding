import { useState, useRef, useEffect } from 'react';
import More from '@/assets/icons/More';
import Company from '@/assets/icons/Company';
import DocumentUpload from '@/assets/icons/DocumentUpload';
import Trash from '@/assets/icons/Trash';
import { SafeImage } from '@/components/ui/SafeImage';
import { MembersList } from '../MemberList/MemberList';
import styles from './Card.module.scss';

export interface TeamMember {
    id: string | number;
    color: string;
    image?: string | null;
    initial: string;
    name: string;
    position: string;
}

export interface EmployeeData {
    id: string;
    title: string;
    name: string;
    position: string;
    initial: string;
    isCompany?: boolean;
    team?: TeamMember[];
    onAddSubdepartment?: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onMoveMember?: (sourceNodeId: string, targetNodeId: string, memberId: string | number) => void;
}

interface CardProps {
    data: EmployeeData;
    isMenuOpen?: boolean;
    onMenuToggle?: (isOpen: boolean) => void;
}

export const Card = ({ data, isMenuOpen = false, onMenuToggle }: CardProps) => {
    const [memberListOpen, setMemberListOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const memberListRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
        const card = cardRef.current?.parentElement;
        if (card) {
            if (memberListOpen || isMenuOpen) {
                card.style.zIndex = '9999';
            } else {
                card.style.zIndex = '';
            }
        }
    }, [memberListOpen, isMenuOpen]);

    useEffect(() => {
        const handleGlobalClick = (event: MouseEvent) => {
            if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onMenuToggle?.(false);
            }
            if (memberListOpen && memberListRef.current && !memberListRef.current.contains(event.target as Node)) {
                setMemberListOpen(false);
            }
        };

        if (memberListOpen || isMenuOpen) {
            document.addEventListener('mousedown', handleGlobalClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleGlobalClick);
        };
    }, [memberListOpen, isMenuOpen, onMenuToggle]);

    const handleCountClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMemberListOpen(prev => !prev);
        onMenuToggle?.(false);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onMenuToggle?.(!isMenuOpen);
        setMemberListOpen(false);
    };

    const handleAddSubdepartment = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        data.onAddSubdepartment?.(data.id);
        onMenuToggle?.(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        data.onEdit?.(data.id);
        onMenuToggle?.(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        data.onDelete?.(data.id);
        onMenuToggle?.(false);
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, memberId: string | number) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            memberId,
            sourceNodeId: data.id
        }));
        e.dataTransfer.effectAllowed = 'move';

        // Set custom drag image to ensure border-radius is respected
        const target = e.currentTarget as HTMLElement;
        if (target) {
            const clone = target.cloneNode(true) as HTMLElement;

            // Explicitly set styles for the drag image
            clone.style.width = '32rem';
            clone.style.height = '32rem';
            clone.style.borderRadius = '50%';
            clone.style.overflow = 'hidden';
            clone.style.position = 'absolute';
            clone.style.top = '-9999rem';
            clone.style.left = '-9999rem';
            clone.style.zIndex = '9999';

            // Ensure the image inside fits
            const img = clone.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
            }

            document.body.appendChild(clone);
            e.dataTransfer.setDragImage(clone, 16, 16);

            requestAnimationFrame(() => {
                document.body.removeChild(clone);
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        try {
            const transferData = JSON.parse(e.dataTransfer.getData('application/json'));
            const { memberId, sourceNodeId } = transferData;

            if (sourceNodeId && memberId && sourceNodeId !== data.id) {
                data.onMoveMember?.(sourceNodeId, data.id, memberId);
            }
        } catch (error) {
            console.error('Failed to parse drag data', error);
        }
    };

    return (
        <div
            ref={cardRef}
            className={`${styles.card} ${isDragOver ? styles.card__dragOver : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={isDragOver ? { borderColor: '#6F61FF', boxShadow: '0 0 0 2rem rgba(111, 97, 255, 0.2)' } : undefined}
        >
            <button className={styles.card__menu} onMouseDown={handleMenuClick}>
                <More />
            </button>

            <div className={styles.card__header}>
                {data.isCompany && <Company />}
                <h3 className={styles.card__title}>{data.title}</h3>
            </div>

            <div className={styles.card__info}>
                <div className={styles.card__avatar}>
                    <span className={styles.card__avatar__initial}>{data.initial}</span>
                </div>
                <div className={styles.card__details}>
                    <span className={styles.card__name}>{data.name}</span>
                    <span className={styles.card__position}>{data.position}</span>
                </div>
            </div>

            {data.team && (
                <div className={styles.card__team}>
                    {data.team.slice(0, 6).map((member, index) => (
                        <div
                            key={member.id || index}
                            className={styles.card__team__avatar}
                            style={{ background: member.color, cursor: 'grab' }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, member.id || index)}
                        >
                            {member.image ? (
                                <SafeImage src={member.image} alt={member.name || ''} fill />
                            ) : (
                                member.initial && <span>{member.initial}</span>
                            )}
                        </div>
                    ))}
                    {data.team.length > 6 && (
                        <button
                            className={styles.card__team__count}
                            onMouseDown={handleCountClick}
                        >
                            +{data.team.length - 6}
                        </button>
                    )}
                </div>
            )}

            {memberListOpen && data.team && (
                <div ref={memberListRef} className={styles.card__memberListWrapper}>
                    <MembersList
                        nodeId={data.id}
                        members={data.team.map((member, index) => ({
                            id: typeof member.id === 'string' ? parseInt(member.id) : (member.id || index + 1),
                            // Map string ID safely or keep original if number
                            originalId: member.id, // Pass original ID for drag
                            name: member.name,
                            position: member.position,
                            avatar: member.image || undefined,
                            initial: member.initial,
                            color: member.color,
                        }))}
                        onClose={() => setMemberListOpen(false)}
                    />
                </div>
            )}

            {isMenuOpen && (
                <div ref={menuRef} className={styles.menu}>
                    <button className={styles.menu__item} onMouseDown={handleAddSubdepartment}>
                        <div className={`${styles.menu__icon} ${styles.menu__icon__add}`}>
                            <DocumentUpload />
                        </div>
                        <div className={styles.menu__content}>
                            <span className={styles.menu__title}>Add subdepartment or team</span>
                            <span className={styles.menu__description}>
                                New department or team will be made subordinate to this department.
                            </span>
                        </div>
                    </button>
                    <button className={styles.menu__item} onMouseDown={handleEdit}>
                        <div className={`${styles.menu__icon} ${styles.menu__icon__edit}`}>
                            <DocumentUpload />
                        </div>
                        <div className={styles.menu__content}>
                            <span className={styles.menu__title}>Edit department</span>
                            <span className={styles.menu__description}>
                                New department or team will be made subordinate to this department.
                            </span>
                        </div>
                    </button>
                    <button className={styles.menu__item} onMouseDown={handleDelete}>
                        <div className={`${styles.menu__icon} ${styles.menu__icon__delete}`}>
                            <Trash />
                        </div>
                        <div className={styles.menu__content}>
                            <span className={styles.menu__title}>Delete</span>
                            <span className={styles.menu__description}>
                                New department or team will be made subordinate to this department.
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Card;