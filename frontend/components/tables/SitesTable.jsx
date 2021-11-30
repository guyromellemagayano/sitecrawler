import { Loader } from "@components/loaders";
import { SitesTableLabels } from "@configs/SitesTableLabels";
import { useSites } from "@hooks/useSites";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo } from "react";
import "twin.macro";

const SitesTable = memo(() => {
	const { sites, errorSites, validatingSites } = useSites();

	// Router
	const { query } = useRouter();

	// Translations
	const { t } = useTranslation("sites");
	const noAvailableSites = t("noAvailableSites");

	// Sites table labels with translations
	const labelsArray = SitesTableLabels();

	return !validatingSites && !errorSites ? (
		sites?.count > 0 && sites?.results?.length > 0 ? (
			<table tw="relative w-full">
				<thead>
					<tr>
						{labelsArray.map((label, key) => {
							return (
								<th
									key={key}
									className="min-width-adjust"
									tw="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
								>
									<span tw="flex items-center justify-start">
										<SiteSorting
											result={query}
											slug={label.slug}
											mutateSite={mutateSite}
											sitesTableLabels={label.label}
											setPagePath={setPagePath}
										/>
										<span tw="flex items-center">{label.label}</span>
									</span>
								</th>
							);
						})}
					</tr>
				</thead>

				<tbody tw="relative divide-y divide-gray-200">
					{sites?.results?.map((value, index) => (
						<DataTable
							componentReady={!validatingSites}
							disableLocalTime={disableLocalTime}
							key={index}
							siteId={parseInt(value.id)}
							siteName={value.name}
							siteUrl={value.url}
							siteVerificationId={parseInt(value.verification_id)}
							siteVerified={value.verified}
						/>
					))}
				</tbody>
			</table>
		) : (
			<section tw="flex flex-col justify-center h-full">
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<h3 tw="text-lg leading-6 font-medium text-gray-500">{noAvailableSites}</h3>
				</div>
			</section>
		)
	) : (
		<Loader />
	);
});

export default SitesTable;
