import { Injectable } from "@angular/core";
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { logo } from '../../assets/img/base64/logo';

@Injectable({
    providedIn: 'root'
})

export class ExcelService{

    gerarPlanilha(fileName:string, worksheetNames: string[], headers: any[][], rows: any[][], totais: {valor_hora: number, horas_mes: number, valor_total_mes: number}[]){
        let workbook = new Workbook();
        worksheetNames.map((name, i) =>{
            let total = totais[i];
            let worksheet = workbook.addWorksheet(name,  {pageSetup:{paperSize: 9, orientation:'landscape', fitToPage:true}});
            let d = new Date();
            let month = new Array();
            month[0] = "JANEIRO";
            month[1] = "FEVEREIRO";
            month[2] = "MARÇO";
            month[3] = "ABRIL";
            month[4] = "MAIO";
            month[5] = "JUNHO";
            month[6] = "JULHO";
            month[7] = "AGOSTO";
            month[8] = "SETEMBRO";
            month[9] = "OUTUBRO";
            month[10] = "NOVEMBRO";
            month[11] = "DEZEMBRO";
            let mes = month[d.getMonth()];
            let ano = new Date().getFullYear();
            
            worksheet.insertRow(1,' ');
            worksheet.insertRow(1,' ');
            worksheet.insertRow(1,' ');
            worksheet.insertRow(1,' ');
            worksheet.insertRow(1,' ');

            let headerRow = worksheet.addRow(headers[i]);
            let colHorasTrab = headers[i].indexOf('Horas Trab') + 1;
            
            const dadosEmpresaColuna = colHorasTrab+1;
            const colExcel = this.getExcelColumn(dadosEmpresaColuna);
            
            worksheet.mergeCells(`A5:${colExcel}5`);
            worksheet.getCell('A5').value = "MEDIÇÃO " + mes + "/" + ano;
            worksheet.getCell('A5').border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell('A5').alignment = {vertical: 'middle', horizontal: 'center'};
            worksheet.getCell('A5').font = { name: 'Consolas', bold: true, size: 8};
     
            let imageId1 = workbook.addImage({ 
                base64: logo,
                extension: 'png',
            });
            
            // estilos do cabeçalho
            headerRow.font = { name: 'Consolas', bold: true, size: 8};
            worksheet.addImage(imageId1, 'A1:C3');
            
            const mergeColunaAte = this.getExcelColumn(colHorasTrab);
            

            worksheet.mergeCells(`E1:${mergeColunaAte}3`);
            worksheet.getCell('E1').border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell('E1').alignment = {vertical: 'middle', horizontal: 'center'};
            worksheet.getCell('E1').value = name;

            worksheet.getCell(`${colExcel}:1`).border = {top: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colExcel}:2`).border = {left: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colExcel}:3`).border = {left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            
            worksheet.getCell(`${colExcel}:1`).alignment = {vertical: 'middle', horizontal: 'center'};
            worksheet.getCell(`${colExcel}:1`).value = "TECHNO LOGIC MANUTENCAO E SERVICOS DE INFORMATICA LTDA"

            worksheet.getCell(`${colExcel}:2`).alignment = {vertical: 'middle', horizontal: 'center'};
            worksheet.getCell(`${colExcel}:2`).value = "Rua Conselheiro Ferraz, 66, Bloco 2, 805 - 20.710-350 – Lins de Vasconcelos – Rio de Janeiro"

            worksheet.getCell(`${colExcel}:3`).alignment = {vertical: 'middle', horizontal: 'center'};
            worksheet.getCell(`${colExcel}:3`).value = "CNPJ: 10.808.473/0001-73"

            for(let i = 1; i <= colHorasTrab + 1; i++){
                headerRow.getCell(i).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
                headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
                
                if (i < colHorasTrab) {
                    worksheet.getColumn(i).width = 11;
                } else if (i === colHorasTrab + 1) {
                    worksheet.getColumn(i).width = 90;
                }
            }
            
            let objrows = worksheet.addRows(rows[i]);
            // Estilos das linhas
            objrows.map(r => {
                r.font = { name: 'Consolas', bold: false, size: 8};
                
                for(let i = 1; i <= colHorasTrab + 1; i++){
                    r.getCell(i).border = {left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                    r.getCell(i).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'dbe5f1'}}
                    
                    if(i < colHorasTrab + 1)
                        r.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
                    else
                        r.getCell(i).alignment = {vertical: 'middle', horizontal: 'left'};
                    
                }

                //r.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                
                // Fundo cinza
                r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
                r.getCell(1).font = {name: 'Consolas', bold: true, size: 8};
                r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
                r.getCell(2).font = {name: 'Consolas', bold: true, size: 8};
                r.getCell(colHorasTrab).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
                r.getCell(colHorasTrab).font = {name: 'Consolas', bold: true, size: 8};
            });

            // Totais
            const colTotIni = dadosEmpresaColuna+2;
            const colTotIniEx = this.getExcelColumn(colTotIni);
            const colTotFim = colTotIni+1;
            const colTotFimEx = this.getExcelColumn(colTotFim);

            worksheet.mergeCells(`${colTotIniEx}5:${colTotFimEx}5`);
            worksheet.getCell(`${colTotIniEx}5`).value = "TOTAIS";
            worksheet.getCell(`${colTotIniEx}5`).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colTotIniEx}5`).alignment = {vertical: 'middle', horizontal: 'center'};
            worksheet.getCell(`${colTotIniEx}5`).font = { name: 'Consolas', bold: true, size: 8};

            worksheet.getCell(`${colTotIniEx}6`).value = "Vlr Hora";
            worksheet.getCell(`${colTotIniEx}6`).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colTotIniEx}6`).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
            worksheet.getCell(`${colTotIniEx}6`).font = {name: 'Consolas', size: 8};
            worksheet.getCell(`${colTotIniEx}6`).numFmt = '$#,##0.00';

            worksheet.getCell(`${colTotFimEx}6`).value = total.valor_hora;
            worksheet.getCell(`${colTotFimEx}6`).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colTotFimEx}6`).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
            worksheet.getCell(`${colTotFimEx}6`).font = {name: 'Consolas', size: 8};
            
            worksheet.getCell(`${colTotIniEx}7`).value = "Horas do Mês";
            worksheet.getCell(`${colTotIniEx}7`).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colTotIniEx}7`).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
            worksheet.getCell(`${colTotIniEx}7`).font = {name: 'Consolas', size: 8};

            worksheet.getCell(`${colTotFimEx}7`).value = total.horas_mes;
            worksheet.getCell(`${colTotFimEx}7`).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colTotFimEx}7`).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
            worksheet.getCell(`${colTotFimEx}7`).font = {name: 'Consolas', size: 8};
            
            worksheet.getCell(`${colTotIniEx}8`).value = "Valor Total Mês";
            worksheet.getCell(`${colTotIniEx}8`).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colTotIniEx}8`).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: '0070c0'}}
            worksheet.getCell(`${colTotIniEx}8`).font = {name: 'Consolas', size: 8, color: {argb: "ffffff"}};

            worksheet.getCell(`${colTotFimEx}8`).value = total.valor_total_mes;
            worksheet.getCell(`${colTotFimEx}8`).border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}};
            worksheet.getCell(`${colTotFimEx}8`).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: '0070c0'}}
            worksheet.getCell(`${colTotFimEx}8`).font = {name: 'Consolas', size: 8, color: {argb: "ffffff"}};

        });

        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, fileName + '.xlsx');
        });
    }

    private getExcelColumn(column: number): string{
        let i = 1;
        let textColumn = 'A';
        while (i < column){
            textColumn = String.fromCharCode(textColumn.charCodeAt(0)+1);
            i++;
        }
        return textColumn;
    }
}