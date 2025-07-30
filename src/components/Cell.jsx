

export default function Cell({ value, onClick, isWinningCell }){
    const cellClass = `cell ${isWinningCell ? "winning-cell" : "" }`;
    return (
        <div className={ cellClass } onClick={ onClick }>
            { value }
            {/* { isWinningCell && <div className={lineClass} ></div> } */}
        </div>
    )
}