import { Injectable } from "@angular/core";
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
    providedIn: 'root'
})

export class ExcelService{

    gerarPlanilha(fileName:string, worksheetNames: string[], headers: any[][], rows: any[][]){
        let workbook = new Workbook();
        worksheetNames.map( (name, i) =>{
            let worksheet = workbook.addWorksheet(name);
            let headerRow = worksheet.addRow(headers[i]);
            let colHorasTrab = headers[i].indexOf('Horas Trab') + 1;
            
            // estilos do cabeçalho
            headerRow.font = { name: 'Roboto Mono', bold: true, size: 8};
            
            for(let i = 1; i <= colHorasTrab+1; i++){
                headerRow.getCell(i).border = {top: {style:'medium'}, left: {style:'medium'}, bottom: {style:'medium'}, right: {style:'medium'} };
                headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
                
                if(i <= 2){
                    worksheet.getColumn(i).width = 10;
                }
                else if (i < colHorasTrab){
                    worksheet.getColumn(i).width = 7;
                }else if (i === colHorasTrab+1){
                    worksheet.getColumn(i).width = 60;
                }

            }
            
            let objrows = worksheet.addRows(rows[i]);
            // Estilos das linhas
            objrows.map(r => {
                
                r.font = { name: 'Roboto Mono', bold: false, size: 8};
                
                for(let i = 1; i <= colHorasTrab+1; i++){
                    r.getCell(i).border = { left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                    r.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'dbe5f1'}}
                    
                    if(i < colHorasTrab + 1)
                        r.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
                    else
                        r.getCell(i).alignment = {vertical: 'middle', horizontal: 'left'};
                    
                }

                //r.border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                
                // Fundo cinza
                r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
                r.getCell(1).font = {name: 'Roboto Mono', bold: true, size: 8};
                r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
                r.getCell(2).font = {name: 'Roboto Mono', bold: true, size: 8};
                r.getCell(colHorasTrab).fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'd8d8d8'}}
                r.getCell(colHorasTrab).font = {name: 'Roboto Mono', bold: true, size: 8};
            })

        });
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, fileName + '.xlsx');
        });
    }
    /*
    private sufixoNomePlanilha(){
        return new Date().toISOString().replace(':','-').replace(':','-').replace('T','_').substr(0,19);
    }
    */
}