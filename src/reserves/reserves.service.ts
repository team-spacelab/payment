import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Reserves } from 'parkingspace-commons'

@Injectable()
export class ReservesService {
  constructor (
    @InjectRepository(Reserves)
    private readonly reservesRepository: Repository<Reserves>
  ) {}

  async delete (id: number) {
    const reserve = await this.reservesRepository.findOne({ where: { id } })
    if (!reserve) throw new NotFoundException('RESERVE_NOTFOUND')

    await this.reservesRepository.delete({ id })
  }

  async foundAndCount (start: Date, end: Date) {
    return await this.reservesRepository.count({
      where: [
        { startAt: Between(start, end) },
        { endAt: Between(start, end) }
      ]
    })
  }

  async createReserve (zoneId: number, userId: number, startAt: Date, endAt: Date) {
    const reserve = await this.reservesRepository.insert({
      zoneId, userId, startAt, endAt, status: 0
    })
    return reserve.generatedMaps[0].id
  }
}
