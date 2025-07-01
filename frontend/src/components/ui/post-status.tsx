
export function PostStatus({children, status}: {children: React.ReactElement, status: string}) {
    if(status === "available"){
    return (
        <div className="w-min bg-green-400  capitalize rounded-md">
            {children}
        </div>
    )
    }
    else if(status === "pending"){
    return (
        <div className="border w-min bg-amber-400 capitalize rounded-md">
            {children}
        </div>
    )
    }
    else if(status === "exchanged"){
    return (
        <div className="border w-min bg-blue-400 capitalize rounded-md">
            {children}
        </div>
    )
    }
    else if(status === "removed"){
    return (
        <div className="border w-min bg-red-400 capitalize rounded-md">
            {children}
        </div>
    )
    }
    else{
        return (
            <div className="border w-min bg-gray-400 capitalize rounded-md">
                {children}
            </div>
        )
    }
}