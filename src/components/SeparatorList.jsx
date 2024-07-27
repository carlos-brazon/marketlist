import { Separator } from "@/components/ui/separator"
import { Button } from "./ui/button"
import { useContext } from "react";
import { AllItemsContext } from "./Contex";

export function SeparatorList() {
    const { list, setList, button } = useContext(AllItemsContext)
    const handleOrder = () => {
        const sortedList = list?.filter(item => item.tags === button).sort((a, b) => a.name.localeCompare(b.name));
        setList(sortedList);
    }
    const handleUrgente = () => {
        const urgentList = list?.filter(item => item.tags === button).sort((a, b) => (a.priority ? -1 : 1) - (b.priority ? -1 : 1));
        setList(urgentList);
    }
    return (
        <div>
            <div className=" flex items-center justify-center space-y-1">
                <h4 className="text-base text-center font-medium leading-none">Lista</h4>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4">
                <Button className='text-sm' variant="outline" value="order" onClick={() => handleOrder()}>Ordenar A-Z</Button>
                <Separator orientation="vertical" />
                <Button className='text-sm' variant="outline" value="priority" onClick={() => handleUrgente()}>Ordenar Urgente</Button>
            </div>
        </div>
    )
}
