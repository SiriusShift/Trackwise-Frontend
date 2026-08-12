import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const CategoryDialog = () => {
  const { control } = useForm({
    resolver: zodResolver(accountSchema),
  });
  return <div>CategoryDialog</div>;
};

export default CategoryDialog;
