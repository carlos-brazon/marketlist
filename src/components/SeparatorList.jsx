import { Separator } from "@/components/ui/separator"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "./ui/button"


export function SeparatorList({ handleOrder, handleUrgente }) {
    return (
        <div>
            <div className=" flex items-center justify-center space-y-1">
                <h4 className="text-lg text-center font-medium leading-none">Lista</h4>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-sm">
                <Button variant="outline" value="order" onClick={() => handleOrder()}>Ordenar A-Z</Button>
                <Separator orientation="vertical" />
                <Button variant="outline" value="priority" onClick={() => handleUrgente()}>Ordenar Urgente</Button>
            </div>

            {/* <ToggleGroup type="single" className="flex h-5 items-center space-x-4 text-sm">
                <ToggleGroupItem value="order" onClick={() => handleOrder()}>Ordenar A-Z</ToggleGroupItem>
                <Separator orientation="vertical" />
                <ToggleGroupItem value="priority" onClick={() => handleUrgente()}>Ordenar Urgente</ToggleGroupItem>
            </ToggleGroup > */}
        </div>
    )
}
