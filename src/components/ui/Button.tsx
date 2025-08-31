"use client";
import clsx from "clsx";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx("btn focus-brand", className)} {...props} />;
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button className="btn-primary" {...props} />;
}