import GroupAddIcon from '@mui/icons-material/GroupAdd';

export default function NeonButton({ onClick }: any) {
    return (
        <div className="neon-button" onClick={onClick}>
            <button></button>
            <GroupAddIcon />
        </div>
    )
}