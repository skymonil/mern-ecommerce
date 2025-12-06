import { AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
const AdminHeader = () => {
  return (
    <div className="">
    <Button>
      <AlignJustify />
      <span className="flex-1 flex justify-end">
        <Button className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow" />
      </span>
    </Button>
    </div>
        )
    }
export default AdminHeader;