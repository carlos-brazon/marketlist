import { Separator } from "@/components/ui/separator"
import { Button } from "./ui/button"

export function SeparatorList({ handleOrder, handleUrgente }) {
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
