import { SuccessResponseObject } from '@akhilome/common';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { JoiSchema } from 'src/common/joi.pipe';
import { CreateQuestionDto, createQuestionSchema } from './question.dto';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async handleCreateQuestion(
    @Req() req,
    @Body(JoiSchema(createQuestionSchema)) body: CreateQuestionDto,
  ) {
    const personId: number = req.user.id;
    const data = await this.questionService.create(personId, body);

    return new SuccessResponseObject('Question created', data);
  }

  @Get('/')
  async fetchAllQuestions() {
    const data = await this.questionService.fetchAll();

    return new SuccessResponseObject('Questions retrieved', data);
  }

  @Get('/:id')
  async fetchOneQuestion(@Param('id') id: string) {
    const data = await this.questionService.fetchQuestionAndAuthor(+id);

    if (!data) {
      throw new NotFoundException('Question does not exist');
    }

    return new SuccessResponseObject('Question retrieved', data);
  }
}
