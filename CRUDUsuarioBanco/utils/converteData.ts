
export = function converteData(dataDMY: string): string {
	let partes: string[];
	if (!dataDMY || !(partes = dataDMY.split('/')) || partes.length !== 3)
		return null;
	let dia: number, mes: number, ano: number;
	if (partes.length !== 3 ||
		isNaN(dia = parseInt(partes[0])) ||
		dia < 1 ||
		dia > 31 ||
		isNaN(mes = parseInt(partes[1])) ||
		mes < 1 ||
		mes > 12 ||
		isNaN(ano = parseInt(partes[2])) ||
		ano < 1900 ||
		ano > 9999)
		return null;

	// Aqui, sabemos que os números ao menos parecem fazer sentido...
	// Agora vamos às regras para meses com 30, 28 ou 29 dias
	switch (mes) {
	case 4:
	case 6:
	case 9:
	case 11:
		if (dia > 30)
			return null;
		break;
	case 2:
		if (dia > 29)
			return null;
		if (dia === 29) {
			// O ano deve ser bissexto
			// Ano bissexto é aquele divisível por 4 e não por 100, ou divisível por 400!
			if ((ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0)
				break;
			return null;
		}
		break;
	}
	return `${partes[2]}-${partes[1]}-${partes[0]}`;
}
