import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateNoteUseCase,
  DeleteNoteUseCase,
  GetAllNotesUseCase,
  GetNoteByIdUseCase,
  UpdateNoteUseCase,
} from '../../application/use-cases/notes.use-cases';

@Controller('api/notes')
export class NotesController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly getAllNotesUseCase: GetAllNotesUseCase,
    private readonly getNoteByIdUseCase: GetNoteByIdUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
  ) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.createNoteUseCase.execute(body);
  }

  @Get()
  findAll() {
    return this.getAllNotesUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getNoteByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    return this.updateNoteUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteNoteUseCase.execute(id);
  }
}
