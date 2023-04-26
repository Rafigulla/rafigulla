select 
	c.card_type, 
	h.card as humo,
	u.card as uzcard, 
	u.data as data_uzcard,
	h.data as data_humo,
	u.tran_date as u_tran_date, 
	h.tran_date as h_tran_date
from cards c 
left join humo h on h.card = c.card 
left join uzcard u on u.card = c.card 
where h.tran_date between '2023-01-15' and '2023-01-20' or
u.tran_date between '2023-01-15' and '2023-01-20' and
c.card in('72980907B21D4EF13520C090D1606B6A','4073420010127383') 
group by c.card_type, h.card, u.card , u.data, h.data, u.tran_date, h.tran_date