import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Instrument } from './instrument.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class InstrumentService {

    private resourceUrl = SERVER_API_URL + 'api/instruments';

    constructor(private http: Http) { }

    create(instrument: Instrument): Observable<Instrument> {
        const copy = this.convert(instrument);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(instrument: Instrument): Observable<Instrument> {
        const copy = this.convert(instrument);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Instrument> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Instrument.
     */
    private convertItemFromServer(json: any): Instrument {
        const entity: Instrument = Object.assign(new Instrument(), json);
        return entity;
    }

    /**
     * Convert a Instrument to a JSON which can be sent to the server.
     */
    private convert(instrument: Instrument): Instrument {
        const copy: Instrument = Object.assign({}, instrument);
        return copy;
    }
}
