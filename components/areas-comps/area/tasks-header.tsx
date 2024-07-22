export default function TasksHeader({
    children,
    handleAddTaskButtonClick,
}: {
    children: React.ReactNode;
    handleAddTaskButtonClick: () => void;
}) {
    return (
        <>
            <div className="w-full flex-between tasks-header sticky top-0 font-bold bg-black border-b">
                <span className="flex-start">Task</span>
                <span>Target</span>
                <span>Achieved</span>
                <span>Unit</span>
                <span>
                    <button onClick={handleAddTaskButtonClick}>New Task</button>
                </span>
            </div>
            {children}
        </>
    );
}
