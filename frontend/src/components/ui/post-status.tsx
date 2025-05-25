
export function PostStatus({children, status}: {children: React.ReactElement, status: string}) {
    if(status === "available"){
    return (
        <div className="border w-min bg-green-300 rounded-md">
            {children}
        </div>
    )
    }
    else if(status === "pending"){
    return (
        <div className="border w-min bg-amber-300 rounded-md">
            {children}
        </div>
    )
    }
    else if(status === "exchanged"){
    return (
        <div className="border w-min bg-blue-300 rounded-md">
            {children}
        </div>
    )
    }
    else if(status === "removed"){
    return (
        <div className="border w-min bg-red-300 rounded-md">
            {children}
        </div>
    )
    }
    else{
        return (
            <div className="border w-min bg-gray-300 rounded-md">
                {children}
            </div>
        )
    }
}