import { ShieldCheck } from "lucide-react";
import inadesLogo from "../assets/inades-favicon.svg";

type AuthSplitLayoutProps = {
	badgeLabel: string;
	title: string;
	description: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
};

const valuePoints = [
	"Secure access with OTP verification",
	"Role-based permissions for Admin, HR, Finance, and Office",
	"Clear, professional workflow for daily operations",
];

export default function AuthSplitLayout({
	badgeLabel,
	title,
	description,
	icon,
	children,
}: AuthSplitLayoutProps) {
	return (
		<div className="inades-page-enter inades-auth-shell flex min-h-screen flex-col">
			<div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 md:px-6 md:py-10">
				<div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#F28C00]/30 bg-[#FFFFFF] shadow-[0_22px_60px_rgba(17,24,39,0.14)] lg:grid-cols-[1.15fr_1fr]">
					<div className="hidden bg-gradient-to-br from-[#F28C00] via-[#F28C00] to-[#CC7600] p-8 text-[#FFFFFF] lg:flex lg:flex-col lg:justify-between">
						<div>
							<div className="inline-flex rounded-xl bg-[#FFFFFF] p-2 shadow-sm">
								<img src={inadesLogo} alt="INADES logo" className="h-14 w-14 object-contain" />
							</div>
							<h2 className="mt-4 text-2xl font-bold">INADES Connect</h2>
							<p className="mt-2 max-w-md text-sm text-[#FFFFFF]/90">
								Digital Management System built for transparent, efficient, and accountable operations.
							</p>
						</div>

						<div className="space-y-3">
							{valuePoints.map((item) => (
								<div key={item} className="flex items-start gap-2 rounded-lg bg-[#FFFFFF]/10 px-3 py-2 text-sm">
									<ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8BE000]" />
									<span>{item}</span>
								</div>
							))}
						</div>
					</div>

					<div className="p-6 md:p-8">
						<div className="mb-5">
							<div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F28C00] px-3 py-1 text-xs font-medium text-[#FFFFFF]">
								{icon ?? <ShieldCheck className="h-3.5 w-3.5" />}
								{badgeLabel}
							</div>
							<h1 className="text-2xl font-bold text-[#000000]">{title}</h1>
							<p className="mt-1 text-sm text-[#000000]/70">{description}</p>
						</div>

						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
