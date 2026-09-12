from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path(__file__).with_name('ayush_setu_workflow_diagrams.png')
W, H = 1920, 1080
BG = '#F7F4EA'; GREEN = '#164A35'; GREEN2 = '#2E7D59'; SAFFRON = '#D99027'
INK = '#18332A'; MUTED = '#567064'; WHITE = '#FFFFFF'; PALE = '#E7F1E9'

im = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(im)
font_path = 'C:/Windows/Fonts/arial.ttf'
bold_path = 'C:/Windows/Fonts/arialbd.ttf'
def f(size, bold=False): return ImageFont.truetype(bold_path if bold else font_path, size)
def rr(box, fill, outline=None, radius=24, width=2): d.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)
def centered(text, box, font, fill=INK, spacing=5):
    d.multiline_text(((box[0]+box[2])//2, (box[1]+box[3])//2), text, font=font, fill=fill,
                     anchor='mm', align='center', spacing=spacing)
def arrow(a, b, color=GREEN):
    d.line([a,b], fill=color, width=7)
    x,y=b; d.polygon([(x,y),(x-18,y-11),(x-18,y+11)], fill=color)
def card(x, y, title, steps, accent=GREEN2):
    rr((x,y,x+570,y+385), WHITE, '#D5E3D8', 30, 3)
    rr((x,y,x+570,y+70), accent, accent, 30)
    d.rectangle((x,y+40,x+570,y+70), fill=accent)
    centered(title, (x+18,y+6,x+552,y+64), f(27, True), WHITE)
    positions = [(x+42,y+118),(x+217,y+118),(x+392,y+118),(x+217,y+275)]
    for i, ((px,py), step) in enumerate(zip(positions,steps), 1):
        rr((px,py,px+135,py+82), PALE if i<4 else '#FFF0D7', None, 16)
        d.ellipse((px+12,py+17,px+45,py+50), fill=accent if i<4 else SAFFRON)
        centered(str(i), (px+12,py+17,px+45,py+50), f(16, True), WHITE)
        centered(step, (px+50,py+10,px+127,py+72), f(15, True), INK)
    arrow((x+177,y+159),(x+211,y+159)); arrow((x+352,y+159),(x+386,y+159))
    arrow((x+459,y+202),(x+302,y+269)); arrow((x+285,y+202),(x+285,y+269))

# header
d.rectangle((0,0,W,145), fill=GREEN)
d.text((95,38), 'AYUSH Setu', font=f(48, True), fill=WHITE)
d.text((95,96), 'Evidence-led skill mapping | Industry matching | Measurable institutional action', font=f(23), fill='#DDECE0')
rr((1530,39,1815,100), '#E7A33A', None, 22)
centered('SIH 2026\nWORKFLOW KIT', (1540,44,1805,95), f(17, True), GREEN)

card(75,210, '1. Student-to-Opportunity Journey', ['Assess\nskills','Build verified\nprofile','Get explainable\nmatch','Apply + track\noutcome'])
card(675,210, '2. Skill-to-Curriculum Feedback Loop', ['Industry posts\nskill demand','Platform maps\ncohort gaps','College assigns\nbridge learning','New evidence\nupdates insight'], '#357B63')
card(1275,210, '3. Certification & Trust Workflow', ['Enroll in\nindustry course','Learn + take\nassessment','Issue verified\ncredential','Share portfolio\nwith employer'], '#2C6A52')

# Bottom overview architecture
rr((75,690,1845,995), WHITE, '#D5E3D8', 30, 3)
d.text((120,733), 'One connected ecosystem, three measurable outcomes', font=f(31, True), fill=INK)
nodes = [
    ('STUDENTS', 'Assessment\n+ portfolio', GREEN2),
    ('AYUSH INSTITUTIONS', 'Skill-gap\nanalytics', '#357B63'),
    ('INDUSTRY PARTNERS', 'Roles, courses\n+ feedback', SAFFRON),
    ('AIIA / NODAL BODY', 'Aggregate insights\n+ governance', GREEN),
]
xs = [165, 580, 995, 1410]
for (title, sub, color), x in zip(nodes,xs):
    rr((x,810,x+300,934), '#F9FBF9', color, 20, 4)
    d.rectangle((x,810,x+300,846), fill=color)
    centered(title, (x+8,814,x+292,842), f(16, True), WHITE)
    centered(sub, (x+15,857,x+285,920), f(20, True), INK)
for a,b in zip(xs[:-1], xs[1:]): arrow((a+310,872),(b-12,872), SAFFRON)
d.text((133,952), 'Output: better readiness, clearer hiring decisions, and data-backed curriculum improvement.', font=f(20, True), fill=MUTED)
im.save(OUT, optimize=True)
print(OUT)
