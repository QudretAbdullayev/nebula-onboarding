import { useState, useRef, useEffect } from 'react';
import More from '@/assets/icons/More';
import Company from '@/assets/icons/Company';
import DocumentUpload from '@/assets/icons/DocumentUpload';
import Trash from '@/assets/icons/Trash';
import { SafeImage } from '@/components/ui/SafeImage';
import { MembersList } from '../MemberList/MemberList';
import styles from './Card.module.scss';

export interface TeamMember {
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

    return (
        <div ref={cardRef} className={styles.card}>
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
                        <div key={index} className={styles.card__team__avatar} style={{ background: member.color }}>
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
                        members={data.team.map((member, index) => ({
                            id: index + 1,
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