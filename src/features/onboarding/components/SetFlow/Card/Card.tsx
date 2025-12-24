import { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import More from '@/assets/icons/More';
import Company from '@/assets/icons/Company';
import Plus from '@/assets/icons/Plus';
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
    id: number;
    title: string;
    name: string;
    position: string;
    initial: string;
    isCompany?: boolean;
    team?: TeamMember[];
    onAddSubdepartment?: (id: number) => void;
}

export const Card = ({ data }: NodeProps<EmployeeData>) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [memberListOpen, setMemberListOpen] = useState(false);
    const memberListRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Dışarı tıklandığında popupları kapat
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (memberListRef.current && !memberListRef.current.contains(event.target as Node)) {
                setMemberListOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (memberListOpen || menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [memberListOpen, menuOpen]);

    const handleCountClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMemberListOpen(prev => !prev);
        setMenuOpen(false);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuOpen(prev => !prev);
        setMemberListOpen(false);
    };

    const handleAddSubdepartment = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        data.onAddSubdepartment?.(data.id);
        setMenuOpen(false);
    };

    return (
        <div className={styles.card}>
            {/* Top handle - for incoming connections */}
            <Handle
                type="target"
                position={Position.Top}
                className={styles.handle}
                style={{
                    background: '#561CCE',
                    width: 10,
                    height: 10,
                    border: '2rem solid #fff',
                }}
            />

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

            {menuOpen && (
                <div ref={menuRef} className={styles.menu}>
                    <button className={styles.menu__item} onMouseDown={handleAddSubdepartment}>
                        <div className={styles.menu__icon}>
                            <Plus />
                        </div>
                        <div className={styles.menu__content}>
                            <span className={styles.menu__title}>Add subdepartment or team</span>
                            <span className={styles.menu__description}>
                                New department or team will be made subordinate to this department.
                            </span>
                        </div>
                    </button>
                </div>
            )}

            {/* Bottom handle - for outgoing connections */}
            <Handle
                type="source"
                position={Position.Bottom}
                className={styles.handle}
                style={{
                    background: '#561CCE',
                    width: 10,
                    height: 10,
                    border: '2rem solid #fff',
                }}
            />
        </div>
    );
};